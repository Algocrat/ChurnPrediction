package services

import javax.inject.Singleton

import scala.collection.mutable.ArrayBuffer


/**
 * A type declaring the interface that will be injectable.
 */
abstract class TreeGenerator() {
  def generate(fileName: String, renamed: String, exclude: String, predict: String): String
}

/**
 * A simple implementation of UUIDGenerator that we will inject.
 */

//p1=filename, p2=directory, p3= predict field location

@Singleton
class SimpleTreeGenerator extends TreeGenerator {

  import org.ddahl.jvmr.RInScala
  import org.rosuda.REngine.REXP
  import org.rosuda.REngine.REXPMismatchException
  import org.rosuda.REngine.Rserve.RConnection
  import org.rosuda.REngine.Rserve.RserveException

  //val R = RInScala()


  //val Tree =
  def generate(fileName: String, renamed: String, exclude: String, predict: String): String = {
    val c = new RConnection()
    var add = false
    var regular = false
    var subtree = false
    var extendTree = false
    var refinedTree = ArrayBuffer[String]()
    var depthPerLevel = ArrayBuffer[Int]()
    var whereClausePerLevel = ArrayBuffer[String]()
    var nameStartPosition = 0
    var formattedRow = ""
    var whereClauseLeftPart = ""
    depthPerLevel += 1
    whereClausePerLevel += "1=1"
    for (rawText <- getTree(fileName, exclude, predict, c)) {
      if (rawText.contains("Decision tree:")) {
        add = true
        val nodeStat = getNodeStat(" 0=0 ", predict, c)
        formattedRow = "[{\"id\": \"1\" , \"name\": \"All\" , \"parentid\": \"-\" , \"distribution\": " + nodeStat + "}]"
        refinedTree += formattedRow
      } else if (rawText.contains("Evaluation on training data")) {
        add = false
        regular = false
      } else if (rawText.startsWith("SubTree [S")) {
        add = false
        regular = false
        extendTree = true
      } else if (add) {
        regular = true
      } else if (extendTree) {
        subtree = true
      }
      if (add && regular) {
        //println(rawText)
        if ((rawText.takeRight(1) == ",") && (rawText.contains("{")) && (!rawText.contains("}"))) {
          //println("(1)" + rawText)
          nameStartPosition = getStartPosition(rawText)
          depthPerLevel = addLevels(depthPerLevel, nameStartPosition)
          whereClauseLeftPart += getWhereClauseLeftPart(nameStartPosition, rawText)
        } else if ((rawText.takeRight(1) == ",")) {
          //println("(2)" + rawText)
          nameStartPosition = getStartPosition(rawText)
          whereClauseLeftPart += getWhereClauseLeftPart(nameStartPosition, rawText)
        } else {
          //println("(3)" + rawText)
          nameStartPosition = getStartPosition(rawText)
          if(whereClauseLeftPart.length() == 0){
            depthPerLevel = addLevels(depthPerLevel, nameStartPosition)
          }
          whereClausePerLevel = addWhereClause(depthPerLevel.length, nameStartPosition, rawText, whereClausePerLevel, whereClauseLeftPart)
          //println(whereClausePerLevel)
          formattedRow = getFormattedRow(depthPerLevel, nameStartPosition, rawText, whereClausePerLevel, predict,c)
          refinedTree += formattedRow
          whereClauseLeftPart = ""
        }

      }
    }
    println( "[" + refinedTree.mkString(" , ") + "]")
    c.close()
    return "[" + refinedTree.mkString(" , ") + "]"
  }

  //p1=filename, p2=directory, p3= predict field location
  def getTree(fileName: String, exclude: String, predict: String, c:RConnection): Array[String] = {

    c.eval("library(C50)")
    c.eval("library(sqldf)")
    c.eval("library(rjson)")
    c.eval("library(plyr)")
    c.eval("data(churn)")
    c.eval("viewerTrain <- read.csv(file.path('/home/tejas/uploadedFiles/23/', '"+ fileName +"'))")
    c.eval(exclude)
    c.eval("treeModel <- C5.0(x = viewerTrain[,!(names(viewerTrain) %in% drops)], y = viewerTrain$ " + predict +", control = C5.0Control(winnow = TRUE, noGlobalPruning = TRUE))")
    val x=c.eval("paste(capture.output(print(summary(treeModel))),collapse='\\n')").asString();
    println(x)
    return x.split("[\\r\\n]+")
  }

  def getStartPosition(rawText:String): Int = {
    val pattern = """[a-zA-Z0-9]""".r
    var l = 0
    val startLoc = (pattern findFirstMatchIn rawText) map (_.start)
    startLoc match {
      case Some(v) => l = v
      case _ => l = 0
    }
    return l
  }
  //(<=|>=|!=|=|>|<)

  
  def refineEquation(equation:String): String = {
    var refinedEquation =""
    if ((equation.takeRight(1) == ",") || (equation.contains("{")) || (equation.contains("}"))){
      refinedEquation = equation.replace("{","( '").replace("}","' )").replace(",","' , '")
    }else {
      val pattern1 = """(<=|>=|!=|=|>|<)""".r
      var l1, l2 = 0
      val startLoc1 = (pattern1 findFirstMatchIn equation) map (_.start)
      startLoc1 match {
        case Some(v) => l1 = v
        case _ => l1 = 0
      }
      val operatorAndRightPart = equation.substring(l1)
      //println(l1.toString())
      val pattern2 = """[a-zA-Z0-9]""".r
      val startLoc2 = (pattern2 findFirstMatchIn operatorAndRightPart) map (_.start)
      startLoc2 match {
        case Some(v) => l2 = v
        case _ => l2 = 0
      }
      refinedEquation = equation.substring(0, l1+l2) + "'" +operatorAndRightPart.substring(l2) +"'"
    }
    //println(l2.toString())
    return refinedEquation
  }
 def replaceCurls(equation:String): String = {
   return equation.replace("{","(  ").replace("}","  )")
 }

  def addWhereClause(indexArrayLength:Int,nameStartPosition:Int,rawText:String,whereClausePerLevel:ArrayBuffer[String],whereClauseLeftPart:String):ArrayBuffer[String] = {
    val n = whereClausePerLevel.length
      if (n >= indexArrayLength){
        //println("indexArrayLength: "+indexArrayLength.toString())
        //println("whereClausePerLevel.length :"+whereClausePerLevel.length.toString())
        for( a <- indexArrayLength to n){
          //println("removing one...")
          whereClausePerLevel.remove(indexArrayLength-1)
          //println("whereClausePerLevel.length :"+whereClausePerLevel.length.toString())
        }
      }
      val whereClauseRightPart = getWhereClause(nameStartPosition,rawText)
      val whereClause = whereClauseLeftPart+whereClauseRightPart
      whereClausePerLevel += whereClause
    //println(whereClausePerLevel.mkString(" and "))
    return whereClausePerLevel
  }


  def addLevels(levels:ArrayBuffer[Int],nameStartPosition:Int):ArrayBuffer[Int] = {
    val level = ((nameStartPosition/4)+1)
    val n = levels.length
    val m = level + 1
    val l = n - 1
    if (n > level){
      //println(levels.mkString(" | "))
      levels(level)+= 1
      if (n > m){
        //println(levels.mkString(" | "))
        //println("Adjustment required..")
        //println("m:"+m.toString())
        //println("l:"+l.toString())
        for( a <- m to l){
          //println( "Value of a: " + a )
          levels.remove(m)
         // println(levels.mkString(" | "))
        }
        //levels.remove(m, l)
        //println("Adjustment made..")
        //println(levels.mkString(" | "))
      }

    }else{
      levels += 1
    }
    //println(levels.mkString(""))
  return levels
  }

  def getWhereClause(nameStartPosition:Int,rawText:String):String= {
    val nameEndPosition = (rawText.lastIndexOf(":"))-1
    //println(rawText)
    //println(nameStartPosition)
    //println(nameEndPosition)
    var whereClause = rawText.substring(nameStartPosition, nameEndPosition+1)
    whereClause = refineEquation(whereClause)
    return whereClause
  }

  def getWhereClauseLeftPart(nameStartPosition:Int,rawText:String):String= {
    val nameEndPosition = (rawText.lastIndexOf(","))
    //println(rawText)
    //println(nameStartPosition)
    //println(nameEndPosition)
    var leftWhereClause = rawText.substring(nameStartPosition, nameEndPosition+1)
    leftWhereClause = refineEquation(leftWhereClause)
    return leftWhereClause
  }

  def getNodeStat(whereClause:String, predict:String, c:RConnection):String={
    //println(whereClause)
    val predict2 = predict.replace("\"","\\\"")
    c.eval("nodeStat <- t(sqldf(\"select proper(" + predict2 +") Viewer, count(*) Frequency from viewerTrain where "+whereClause+" group By " + predict2 +" Union All select 'Total', count(*) from viewerTrain where "+whereClause+";\"))")
    c.eval("colnames(nodeStat)<-nodeStat[1,]")
    c.eval("nodeStat <- nodeStat[2,]")
    val nodeStat ="["+c.eval("paste(capture.output(print(toJSON(nodeStat))),collapse='\\n')").asString().dropRight(1).replace("[1] \"","").replace("\\","")+"]"
    println("Node Stat: "+nodeStat)
    return nodeStat
  }

  def getFormattedRow(depthPerLevel:ArrayBuffer[Int],nameStartPosition:Int,rawText:String, whereClausePerLevel:ArrayBuffer[String], predict:String, c:RConnection):String= {
    val nodeID = depthPerLevel.mkString("")
    val nameEndPosition = (rawText.lastIndexOf(":"))-1
    val displayName = rawText.substring(nameStartPosition, nameEndPosition+1)
    var isLeafNode = false
    if ((rawText.length-nameEndPosition)<3){
      isLeafNode = true
    }
    //val whereClause = getWhereClause(nameStartPosition,rawText)
    val whereClause = whereClausePerLevel.mkString(" and ")
    //println("Where clause: "+ whereClause)
    val nodeStat = getNodeStat(whereClause, predict,c)
    var rowElements = ArrayBuffer[String]()
    rowElements += "\"id\": \""+nodeID+"\""
    rowElements += "\"name\": \""+displayName.toString()+"\""
    rowElements += "\"parentid\": \""+nodeID.dropRight(1)+"\""
    rowElements += "\"distribution\": "+nodeStat
    //rowElements += "\"depth\": \""+nodeID.length.toString()+"\""
    //rowElements += "\"isleaf\": \""+isLeafNode.toString()+"\""


    println("Where clause: "+ whereClause)
    //println("\"NodeID\": \""+nodeID+"\"") //NodeID
    //println("\"DisplayName\": \""+displayName.toString()+"\"") //RefinedName
    //println("\"ParentID\": \""+nodeID.dropRight(1)+"\"") //ParentID
    //println("\"Distribution\": "+nodeStat) //NodeStat
    //println("\"Depth\": \""+nodeID.length.toString()+"\"")  //Depth
    //println("\"IsLeaf\": \""+isLeafNode.toString()+"\"") //IsLeaf
    return "[{"+rowElements.mkString(" , ")+"}]"
  }

}

  /*
{
var sum:Int = 0
sum = a + b

return sum
}

    */
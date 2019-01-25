package controllers

import javax.inject.{Singleton, Inject}
import java.io.FileOutputStream
import services.UUIDGenerator
import org.slf4j.{LoggerFactory, Logger}
import play.api.mvc._
import play.mvc.Http._
import scala.io.Source



/**
 * Instead of declaring an object of Application as per the template project, we must declare a class given that
 * the application context is going to be responsible for creating it and wiring it up with the UUID generator service.
 * @param uuidGenerator the UUID generator service we wish to receive.
 */
@Singleton
class Application @Inject() (uuidGenerator: UUIDGenerator) extends Controller {

  private final val logger: Logger = LoggerFactory.getLogger(classOf[Application])

  def index = Action {
    logger.info("Serving index page...")
    Ok(views.html.index())
  }

  def randomUUID = Action {
    logger.info("calling UUIDGenerator...")
    Ok(uuidGenerator.generate.toString)
  }

  def upload() = Action(parse.multipartFormData) { request =>
    request.body.file("picture").map { picture =>
      import java.io.File
      val filename = picture.filename
      val contentType = picture.contentType
      val userID = request.body.dataParts.get("uid").toList.flatten.lift(0).head
      val dir = new File(sys.env("HOME"), "uploadedFiles/"+userID)
      dir.mkdirs()
      //picture.ref.moveTo(new File(s"dir/$filename"))
      picture.ref.moveTo(new File(dir, filename))
      val src = Source.fromFile(dir+"/"+filename)
      val line = src.getLines.take(1).next.toString()
      println(line)
      src.close
      Ok(line)
    }.getOrElse {
      Redirect(routes.Application.index).flashing(
        "error" -> "Missing file")
    }
  }



}

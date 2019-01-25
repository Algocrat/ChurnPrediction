name := "Swami"

version := "1.0"

lazy val `swami` = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

crossScalaVersions := Seq("2.10.2", "2.10.3", "2.10.4", "2.11.0", "2.11.1", "2.11.2", "2.11.3", "2.11.4")

sbtVersion := "0.13.0"

// Comment to get more information during initialization
logLevel := Level.Warn

libraryDependencies ++= Seq(
  jdbc ,
  anorm ,
  cache ,
  ws ,
  "com.google.inject" % "guice" % "3.0",
  "javax.inject" % "javax.inject" % "1",
  "org.reactivemongo" %% "play2-reactivemongo" % "0.10.5.0.akka23",
  "org.scalatest" % "scalatest_2.11" % "2.2.0" % "test"
)

unmanagedResourceDirectories in Test <+=  baseDirectory ( _ /"target/web/public/test" )

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"



fork in run := true
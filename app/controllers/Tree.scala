package controllers

import javax.inject.{Singleton, Inject}
import services.TreeGenerator
import org.slf4j.{LoggerFactory, Logger}
import play.api.mvc._


/**
 * Instead of declaring an object of Application as per the template project, we must declare a class given that
 * the application context is going to be responsible for creating it and wiring it up with the UUID generator service.
 * @param treeGenerator the UUID generator service we wish to receive.
 */
@Singleton
class Tree @Inject() (treeGenerator: TreeGenerator) extends Controller {

  private final val logger: Logger = LoggerFactory.getLogger(classOf[Application])

  def treeGen (fileName: String, renamed: String, exclude: String, predict: String) = Action {
    logger.info("calling TreeGenerator...")
    Ok(treeGenerator.generate(fileName, renamed, exclude, predict))
  }

}

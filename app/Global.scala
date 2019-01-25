import com.google.inject.{Guice, AbstractModule}
import play.api.GlobalSettings
import services.{TreeGenerator, SimpleTreeGenerator, SimpleUUIDGenerator, UUIDGenerator}

/**
 * Set up the Guice injector and provide the mechanism for return objects from the dependency graph.
 */
object Global extends GlobalSettings {

  /**
   * Bind types such that whenever UUIDGenerator is required, an instance of SimpleUUIDGenerator will be used.
   *
   *
  // Declare that the provider for this is a singleton
  bind(DefaultSettings.class).in(Singleton.class);

  // Bind the interfaces to the provider of the DefaultSettings (which is a singleton)
  bind(FirstSettings.class).to(DefaultSettings.class);
  bind(SecondSettings.class).to(DefaultSettings.class);

   */
  val injector = Guice.createInjector(new AbstractModule {
    protected def configure() {
      bind(classOf[TreeGenerator]).to(classOf[SimpleTreeGenerator]);
      bind(classOf[UUIDGenerator]).to(classOf[SimpleUUIDGenerator]);
    }
  })

  /**
   * Controllers must be resolved through the application context. There is a special method of GlobalSettings
   * that we can override to resolve a given controller. This resolution is required by the Play router.
   */
  override def getControllerInstance[A](controllerClass: Class[A]): A = injector.getInstance(controllerClass)
}

package controllers;

import models.Flight;
import play.mvc.With;

/**
 * @author David Cheong
 * @since 14/10/2010
 */
@With(Secure.class)
@CRUD.For(Flight.class)
public class FlightsAdmin extends CRUD {


}

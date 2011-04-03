package models;

/**
 * @author David Cheong
 * @since 3/04/2010
 */
public enum City {

    AUCKLAND("Auckland"),
    BERLIN("Berlin"),
    HONG_KONG("Hong Kong"),
    LONDON("London"),
    NEW_YORK("New York"),
    SAN_FRANCISCO("San Francisco"),
    PARIS("Paris"),
    SYDNEY("Sydney");

    String label;

    City(String label) {
        this.label = label;
    }

}

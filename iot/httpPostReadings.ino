/***************************************************************************
  SensorId:s and secret token are based on data in the sample database.
  Replace HOST; WIFI_NAME and WIFI_PASSWORD as needed. 
  Tested with NodeMCU ESP8266 development board and BMP280 sensor.
 ***************************************************************************/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

#include <SPI.h>
#include <Adafruit_BMP280.h>
#include <Wire.h>


String serverName = "http://HOST/graphql";
String wifiName = "WIFI_NAME";
String wifiPassword = "WIFI_PASSWORD";
String sensor1Id = "73086b39-d26f-490a-885b-ea64695a0c08";
String sensor2Id = "4a9677cc-de38-46a5-945f-48a079d6d562";
String secret = "naP1Yj46bE";


Adafruit_BMP280 bmp; // use I2C interface
Adafruit_Sensor *bmp_temp = bmp.getTemperatureSensor();
Adafruit_Sensor *bmp_pressure = bmp.getPressureSensor();

void setup()
{
  Serial.begin(115200);
  Serial.println();

  WiFi.begin(wifiName, wifiPassword);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  bmp.begin(0x76, 0x58);
  /* Default settings from datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

  bmp_temp->printSensorDetails();

}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {

    // Get temperature and pressure
    sensors_event_t temp_event, pressure_event;
    bmp_temp->getEvent(&temp_event);
    bmp_pressure->getEvent(&pressure_event);
    Serial.print(F("Temperature = "));
    Serial.print(temp_event.temperature);
    Serial.println(" *C");
    Serial.print(F("Pressure = "));
    Serial.print(pressure_event.pressure);
    Serial.println(" hPa");
    Serial.println();

    // Create json object
    // TODO: Allocate correct ram to json
    DynamicJsonDocument root(1024);
    StaticJsonDocument<300> readingsDoc;
    JsonArray readings = readingsDoc.to<JsonArray>();
    JsonObject reading1 = readings.createNestedObject();
    JsonObject reading2 = readings.createNestedObject();
    StaticJsonDocument<300> dataDoc;
    JsonObject data = dataDoc.to<JsonObject>();
    StaticJsonDocument<300> variablesDoc;
    JsonObject variables = variablesDoc.to<JsonObject>();

    reading1["sensorId"] = sensor1Id;
    reading1["content"] = temp_event.temperature;

    reading2["sensorId"] = sensor2Id;
    reading2["content"] = pressure_event.pressure;

    data["secret"] = secret;
    data["readings"] = readings;
    variables["data"] = data;
    root["query"] = "mutation CreateReadings($data: CreateReadingsInput!) {createReadings(data: $data)}";
    root["variables"] = variables;

    char json_string[512];
    serializeJson(root, json_string);
    Serial.println(json_string);


    //Upload to graphql server
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);  // HTTP
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(json_string);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
    Serial.println("------------------------------------");
  }
  else {
    Serial.println("WiFi Disconnected");
  }
  delay(10 * 60 * 1000); //10 minutes
}
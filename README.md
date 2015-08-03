# Parse.com Push notifications for Titanium

[![Dependencies](https://david-dm.org/Sensimity/com.sensimity.ti.parse/status.svg?style=flat-square)](https://david-dm.org/Sensimity/com.sensimity.ti.parse#info=dependencies)
[![Dev Dependencies](https://david-dm.org/Sensimity/com.sensimity.ti.parse/dev-status.svg?style=flat-square)](https://david-dm.org/Sensimity/com.sensimity.ti.parse#info=devDependencies)

## Usage

A packaged *CommonJS* module can be found via [Releases](https://github.com/Sensimity/com.sensimity.ti.parse/releases). Follow the guide on [Using a Module](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_a_Module) or use gitTio:

	gittio install com.sensimity.ti.parse
	
### Configuration
To be able to use this module you'll need to add 2 types of configuration:

* Alloy.CFG (*iOS, Android*)
* tiapp.xml (*Android*)

#### Alloy.CFG
```
"parse": {
  "appId": "<your parse.com app id>",
  "apiKey": "<your parse.com rest api key"
}
```

#### tiapp.xml
```
<property name="Parse_AppId" type="string">your parse.com app id</property>
<property name="Parse_ClientKey" type="string">your parse.com client key</property>
```

For Android support this module has a dependency to an additional [Parse](https://github.com/timanrebel/Parse) module to be able to subscribe your device for GCM. 

## Known issues

This library only works for Alloy based Titanium apps because internally Backbone is used for the event dispatching.

## Changelog

* 0.1.0 Initial version

## Issues

Please report issues and features requests in the repo's [issue tracker](https://github.com/Sensimity/com.sensimity.ti.parse/issues).

## Credits

* [@smclab](https://github.com/smclab) for [titaniumifier](https://github.com/smclab/titaniumifier)
* [@timanrebel](https://github.com/timanrebel) for [Parse](https://github.com/timanrebel/Parse)
* [@jasonkneen](https://github.com/jasonkneen) for [RESTe](https://github.com/jasonkneen/RESTe)
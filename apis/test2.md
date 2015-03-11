FORMAT: 1A

# Resource Model API
Resource model is a [resource manifestation](http://www.w3.org/TR/di-gloss/#def-resource-manifestation). One particular representation of your resource. 

Furthermore, in API Blueprint, any `resource model` you have defined can be referenced in a request or response section, saving you lots of time maintaining your API blueprint. You simply define a resource model as any payload (e. g. [request](https://github.com/apiaryio/api-blueprint/blob/master/examples/6.%20Requests.md) or [response](https://github.com/apiaryio/api-blueprint/blob/master/examples/5.%20Responses.md)) and then reference it later where you would normally write a `request` or `response`.

## API Blueprint
+ [Previous: Parameters](7.%20Parameters.md)
+ [This: Raw API Blueprint](https://raw.github.com/apiaryio/api-blueprint/master/examples/8.%20Resource%20Model.md)

# Group Messages
Group of all messages-related resources.

## Messages [/messages]

+ Model (application/vnd.siren+json)
  
    This is the `application/vnd.siren+json` message resource representation.

    + Headers
    
            Location: http://api.acme.com/message            

    + Body

            {
              "class": [ "message" ],
              "properties": { 
                    "message": "Hello World!" 
              },
              "links": [
                    { "rel": "self" , "href": "/message" }
              ]
            }

### Post a Message [POST]
At this point we will utilize our `Message` resource model and reference it in `Response 200`.

+ Response 201

    [Messages][]
    
### Retrieve all Messages [GET]
At this point we will utilize our `Message` resource model and reference it in `Response 200`.

+ Response 200

    [Messages][]

## Single Message [/message/:id]

+ Model (application/vnd.siren+json)
  
    This is the `application/vnd.siren+json` message resource representation.

    + Headers
    
            Location: http://api.acme.com/message            

    + Body

            {
              "class": [ "message" ],
              "properties": { 
                    "message": "Hello World!" 
              },
              "links": [
                    { "rel": "self" , "href": "/message" }
              ]
            }

### Retrieve a Message [GET]
At this point we will utilize our `Message` resource model and reference it in `Response 200`.

+ Response 200

    [Single Message][]

### Update a Message [PUT]

+ Request Update Plain Text Message (text/plain)

        All your base are belong to us.

+ Request Update JSON Message (application/json)

        { "message": "All your base are belong to us." }

+ Response 204

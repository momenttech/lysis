'use strict';

var getContextFromApi = function(api) {

  var resourceTypes = [];

  var getFieldType = function(field) {
    var type = {
      type: 'text',
      scalar: true
    };
    var identifiers = {
      'http://schema.org/email': 'email',
      'http://schema.org/url': 'url'
    };
    if (identifiers[field.id]) {
      type.type = identifiers[field.id];
      return type;
    }

    var ranges = {
      'http://www.w3.org/2001/XMLSchema#integer': 'integer',
      'http://www.w3.org/2001/XMLSchema#decimal': 'decimal',
      'http://www.w3.org/2001/XMLSchema#string': 'string',
      'http://www.w3.org/2001/XMLSchema#boolean': 'boolean',
      'http://www.w3.org/2001/XMLSchema#date': 'date',
      'http://www.w3.org/2001/XMLSchema#time': 'time',
      'http://www.w3.org/2001/XMLSchema#dateTime': 'dateTime'
    };
    if (ranges[field.range]) {
      type.type = ranges[field.range];
      return type;
    }

    // service type, looks like http://localhost:8000/docs.jsonld#Book
    var potentialType = field.range.split('#')[1];
    if (resourceTypes.indexOf(potentialType) !== -1) {
      type.type = potentialType;
      type.scalar = false;
    }

    return type;
  };

  var makeResourceFields = function(outputResource, fields, listType) {
    for (var i = 0 ; i < fields.length ; i++) {
      var field = fields[i];
      if (!outputResource.fields[field.name]) {
        var type = getFieldType(field);
        outputResource.fields[field.name] = {
          name: field.name,
          description: field.description,
          type: type.type,
          scalar: type.scalar,
          rawType: field.range,
          rawTypeId: field.id,
          required: field.required
        };
      }
      if (listType === 'readable') {
        outputResource.fields[field.name].readable = true;
      }
      if (listType === 'writable') {
        outputResource.fields[field.name].writable = true;
      }
    }
  };

  var makeResource = function(resource) {
    var outputResource = {
      name: resource.name,
      title: resource.title,
      url: resource.url,
      fields: {}
    };

    makeResourceFields(outputResource, resource.readableFields, 'readable');
    makeResourceFields(outputResource, resource.writableFields, 'writable');
    //console.log(outputResource);
    return outputResource;
  };


  var context = {
    entrypoint: api.entrypoint,
    title: api.title,
    resources: {}
  };

  for (var i = 0 ; i < api.resources.length ; i++) {
    resourceTypes.push(api.resources[i].title);
  }
  //console.log(resourceTypes);

  for (i = 0 ; i < api.resources.length ; i++) {
    var resource = api.resources[i];
    context.resources[resource.name] = makeResource(resource);
  }

  return context;
};

module.exports = getContextFromApi;

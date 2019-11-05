'use strict';

var getContextFromApi = function(api) {

  var resourceTypes = {};

  var getFieldType = function(field) {
    var type = {
      type: 'text',
      scalar: true,
      range: field.range,
      id: field.id,
      resource: null,
      multiple: false
    };
    var range = field.range;

    if (range && range.endsWith('[]')) {
      range = range.substr(0, range.length - 2);
      type.multiple = true;
    }
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
    if (ranges[range]) {
      type.type = ranges[range];
      return type;
    }

    if (!range) {
      let fieldName = field.id ? field.id.split('#')[1] : field.name;
      throw new Error('Error while getting resource type for "' + fieldName + '"');
    }

    // get potential object type from range. Maybe a better solution exists?
    // service type, looks like http://localhost:8000/docs.jsonld#Book
    var potentialType = range.split('#')[1];
    if (!potentialType && (range.indexOf('schema.org/') !== -1)) {
      // http://schema.org/Book
      potentialType = range.split('/').slice(-1)[0];
    }
    if (resourceTypes[potentialType]) {
      type.type = potentialType;
      type.resource = resourceTypes[potentialType];
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
          type: type,
          required: field.required,
          readable: false,
          writable: false
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

  api.api.resources.sort(function(a, b) { if (a.name === b.name) { return 0; } if (a.name > b.name) { return 1; } else { return -1; } });
  for (var i = 0 ; i < api.api.resources.length ; i++) {
    resourceTypes[api.api.resources[i].title] = api.api.resources[i].name;
  }
  //console.log(resourceTypes);

  for (i = 0 ; i < api.api.resources.length ; i++) {
    var resource = api.api.resources[i];
    context.resources[resource.name] = makeResource(resource);
  }

  return context;
};

module.exports = getContextFromApi;

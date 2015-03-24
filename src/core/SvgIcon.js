'use strict';

service('SvgIcon', function(service) {

  function SvgIcon(element, options) {
    var
      nodeWrapper = service('nodeWrapper'),
      iconManager = service('iconManager'),
      parseSvgOptions = service('parseSvgOptions'),
      svgElement,
      svgNode,
      attributes,
      styles,
      defaultAttributes,
      index,
      originNode,
      node,
      iconSize;

    options = parseSvgOptions(options);
    element = nodeWrapper(element);
    originNode = element[0];

    element.removeAttr('id');

    if (originNode.tagName != 'svg') {
      if (originNode.tagName == 'symbol') {
        svgElement = nodeWrapper('<svg xmlns="http://www.w3.org/2000/svg">');
        svgNode = svgElement[0];
        attributes = originNode.attributes;
        for (index = 0; index < attributes.length; index++) {
          svgNode.setAttribute(attributes[index].name, attributes[index].value);
        }
        element = svgElement.append(originNode.children);
      }
      else {
        element = nodeWrapper('<svg xmlns="http://www.w3.org/2000/svg">').append(element);
      }
    }
    node = element[0];

    defaultAttributes = {
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.0'
    };

    Object.keys(defaultAttributes)
      .forEach(function(name) {
        if (!node.getAttribute(name)) {
          node.setAttribute(name, defaultAttributes[name]);
        }
      });

    iconSize = options.iconSize || iconManager.getDefaultIconSize();

    attributes = {
      fit: '',
      height: '100%',
      width: '100%',
      preserveAspectRatio: 'xMidYMid meet',
      viewBox: node.getAttribute('viewBox') || options.viewBox || ('0 0 ' + iconSize + ' ' + iconSize)
    };

    Object.keys(attributes)
      .forEach(function(name) {
        node.setAttribute(name, attributes[name]);
      });

    styles = {
      "pointer-events": 'none',
      display: 'inline-block'
    };

    Object.keys(styles)
      .forEach(function(name) {
        node.style[name] = styles[name];
      });

    this.node = node;
    this.iconSize = iconSize;
  }

  SvgIcon.loadByUrl = function(url, options) {
    var
      loadSvgByUrl = service('loadSvgByUrl');

    return loadSvgByUrl(url)
      .then(function(element) {
        return new SvgIcon(
          element,
          options
        )
      });
  };

  SvgIcon.prototype = {

    clone: function() {
      return this.node.cloneNode(true);
    }

  };

  return SvgIcon;

});
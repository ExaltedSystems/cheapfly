import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.menuPlugin()
  }

  menuPlugin() {
    'use strict';
    var DataKey = 'lte.tree';

    var Default = {
        animationSpeed: 500,
        accordion     : true,
        followLink    : false,
        trigger       : '.treeview a'
    };

    var Selector = {
        tree        : '.tree',
        treeview    : '.treeview',
        treeviewMenu: '.treeview-menu',
        open        : '.menu-open, .active',
        li          : 'li',
        data        : '[data-widget="tree"]',
        active      : '.active'
    };

    var ClassName = {
        open: 'menu-open',
        tree: 'tree'
    };

    var Event = {
        collapsed: 'collapsed.tree',
        expanded : 'expanded.tree'
    };

    // Tree Class Definition
    // =====================
    var Tree = function (element, options) {
        this.element = element;
        this.options = options;

        jQuery(this.element).addClass(ClassName.tree);

        jQuery(Selector.treeview + Selector.active, this.element).addClass(ClassName.open);

        this._setUpListeners();
    };

    Tree.prototype.toggle = function (link, event) {
        var treeviewMenu = link.next(Selector.treeviewMenu);
        var parentLi     = link.parent();
        var isOpen       = parentLi.hasClass(ClassName.open);

        if (!parentLi.is(Selector.treeview)) {
        return;
        }

        if (!this.options.followLink || link.attr('href') === '#') {
        event.preventDefault();
        }

        if (isOpen) {
        this.collapse(treeviewMenu, parentLi);
        } else {
        this.expand(treeviewMenu, parentLi);
        }
    };

    Tree.prototype.expand = function (tree, parent) {
        var expandedEvent = jQuery.Event(Event.expanded);

        if (this.options.accordion) {
        var openMenuLi = parent.siblings(Selector.open);
        var openTree   = openMenuLi.children(Selector.treeviewMenu);
        this.collapse(openTree, openMenuLi);
        }

        parent.addClass(ClassName.open);
        tree.slideDown(this.options.animationSpeed, function () {
        jQuery(this.element).trigger(expandedEvent);
        }.bind(this));
    };

    Tree.prototype.collapse = function (tree, parentLi) {
        var collapsedEvent = jQuery.Event(Event.collapsed);

        tree.find(Selector.open).removeClass(ClassName.open);
        parentLi.removeClass(ClassName.open);
        tree.slideUp(this.options.animationSpeed, function () {
        tree.find(Selector.open + ' > ' + Selector.treeview).slideUp();
        jQuery(this.element).trigger(collapsedEvent);
        }.bind(this));
    };

    // Private
    
    Tree.prototype._setUpListeners = function () {
        var that = this;

        jQuery(this.element).on('click', this.options.trigger, function (event) {
        that.toggle(jQuery(this), event);
        });
    };

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function () {
        var jQuerythis = jQuery(this);
        var data  = jQuerythis.data(DataKey);

        if (!data) {
            var options = jQuery.extend({}, Default, jQuerythis.data(), typeof option == 'object' && option);
            jQuerythis.data(DataKey, new Tree(jQuerythis, options));
        }
        });
    }

    var old = jQuery.fn.tree;

    jQuery.fn.tree             = Plugin;
    jQuery.fn.tree.Constructor = Tree;

    // No Conflict Mode
    // ================
    jQuery.fn.tree.noConflict = function () {
        jQuery.fn.tree = old;
        return this;
    };

    jQuery(Selector.data).each(function () {
      Plugin.call(jQuery(this));
    });

  };
  
}

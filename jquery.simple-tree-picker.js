/*! $.simpleTreePicker JS
 @version 1.1.0
 @author Alex Meub
 @license WTFPL http://www.wtfpl.net/about/
*/

;(function ( $, window, document, undefined ) {

    var pluginName = "simpleTreePicker",
    // The Name of Using in .data()
        dataPlugin = "plugin_" + pluginName,
    // Default Options
        defaults = {
            tree: {},
            onclick: null,
            name : 'tree-' + String(Math.floor(Math.random() * 100) + 1)
        };

    // The actual plugin constructor
    var Plugin = function ( element ) {
        this.options = $.extend( {}, defaults );
    };

    Plugin.prototype = {

        init: function ( options ) {

            // Extend Options
            $.extend( this.options, options );
            var data = this.options["tree"],
                onclick = this.options["onclick"],
                selected = this.options["selected"],
                elementName = this.options["name"];
            // Build the UL Tree
            // Need to refactor, duplicate code in buildSubTree

            var buildTree = function(data) {
                var html = '<div class="simple-tree '+ elementName +'">',
                    result;

                html += buildSubTree([data], html, 0);
                html += "</div>";
                result = $(html);

                // All click functionality in here
                result.on('click', function(event) {

                    var tagName = event.target.nodeName,
                        classes = event.target.classList;

                    // Show/hide subtrees
                    if (tagName == "INS" && $.inArray("no-caret", classes) == -1) {
                        var $ins = $(event.target).closest('ins'),
                            $subtree = $ins.parent().children("ul");
                        if ($subtree.is(":visible")) {
                            $ins.removeClass("right-down-caret").addClass("right-caret");
                            $subtree.hide();
                        } else {
                            $ins.removeClass("right-caret").addClass("right-down-caret");
                            $subtree.show();
                        }
                    }
                    // Handle changing tree state
                    else if (tagName == "INPUT" || tagName == "LABEL") {

                        // Find actual clicked element
                        var $checkbox = $(event.target).closest('input[type="checkbox"]'),

                        // Find Subtree on Same Level as clicked Input
                            $container = $(event.target).closest('li'),
                            checked = $checkbox.prop("checked");

                        checkChildren($container, checked);
                        checkParent($container, checked);

                        if( onclick ){
                            onclick();
                        }
                    }
                    // Don't prevent default, we want default checking functionality
                });
                return result;
            };

            // Build Subtree Recursively
            var buildSubTree = function(obj, html, i) {
                if (!obj || !obj.length) return "";
                var t = '<ul class="subtree" id="subtree-' + i + '">';
                $(obj).each(function() {
                    t += '<li class="tree-node" id="leaf-' + this.Number + '">';
                    if (this.Children && this.Children.length) t += '<ins class="tree-icon right-down-caret" id="icon-' + i + '"></ins>';
                    else t += '<ins class="tree-icon no-caret" id="icon-' + i + '"></ins>';
                    t += '<input type="checkbox" name="checkbox-' + this.Number + '" id="checkbox-' + this.Number + '"><label for="checkbox-' + this.Number + '" id="' + this.Number + '">' + this.Name + '</label>';
                    i++;
                    t += buildSubTree(this.Children, t, i);
                    t += "</li>";
                });
                t += '</ul>';
				
                return t;
            };

            // Check Children Recursively
            var checkChildren = function(li, checked) {
                if (!li) return;
                var $li = $(li),
                    $ul = $li.children("ul.subtree").length && $li.children("ul.subtree"),
                    $checkbox = $li.children('input[type="checkbox"]');
                if ($ul) {
                    $ul.children("li").each(function() {
                        var childli = $(this);
                        var hasChildUl = !! childli.children("ul.subtree").length;
                        var childCheckbox = childli.children('input[type="checkbox"]');
                        childCheckbox.prop("checked", checked);
                        // If Parent state is known, child cannot be indeterminate
                        childCheckbox[0].indeterminate = false;
                        if (hasChildUl) checkChildren(this, checked);
                    });
                } else {
                    $checkbox.prop("checked", checked);
                }
            };

            // Check Parent Recursively
            var checkParent = function(li, checked) {
                if (!li) return;
                var $parent = $(li).closest(".subtree"),
                    $checkbox = $parent.siblings("input"),
                    checkedChildren = $parent.children("li").children("input:checkbox:checked"),
                    uncheckedChildren = $parent.children("li").children("input:checkbox:not(:checked)"),
                    indeterminateChildren = false; // sad, sad children ;(

                // Find any indeterminate children
                $parent.children("li").children("input:checkbox:not(:checked)").each( function(){
                    if( this.indeterminate ){
                        indeterminateChildren = true;
                    }
                });
                // Set up conditions
                var noSelectedChildren = !checkedChildren.length,
                    someSelectedChildren = checkedChildren.length && uncheckedChildren.length,
                    allSelectedChildren = !uncheckedChildren.length;

                // If parent has no selected or indeterminate children, its unchecked
                if( noSelectedChildren && !indeterminateChildren){
                    $checkbox.prop({
                        indeterminate: false,
                        checked: false
                    });
                }
                // If parent has all selected children, it's checked
                else if( allSelectedChildren ){
                    $checkbox.prop({
                        indeterminate: false,
                        checked: "checked"
                    });
                }
                // If parent has some unselected children, or indeterminate children, its indeterminate
                else if( someSelectedChildren || indeterminateChildren){
                    $checkbox.prop({
                        indeterminate: true,
                        checked: false
                    });
                }
                if( $parent.parent().length )
                    checkParent( $parent.parent(), checked );
            };

            $(this.element).append(buildTree(data));

            // Go through "selected" locations and select them
            if( selected && selected.length ){
               for( var i =0; i< selected.length; i++ ) {
                  var $checkbox = $('#checkbox-' + selected[i]),
                      $container = $checkbox.closest('li');

                  $checkbox.prop("checked", true);
                  checkChildren($container, true);
                  checkParent($container, true);
               }
            }
        },
        // Public Clear
        clear: function () {

            $(this.element).find('input').each(function(){
                var $checkbox = $(this);
                $checkbox.prop({
                    indeterminate: false,
                    checked: false
                });

            });
            return true;
        },
        // Public Getter
        // Should refactor these both into one
        val: function () {
            var valuesArray  = [];
                $(this.element).find('li').each(function(){
                    var li = $(this),
                        parentLi = li.parent() && li.parent().parent() ?  li.parent().parent() : null,
                        parentLiIsChecked = parentLi ? parentLi.children("input").prop("checked") : false;
                    if( !parentLiIsChecked && $(this).children("input").prop("checked") )
                        valuesArray.push( $(this).children("label").attr("id") );
                });
            return valuesArray;
        },
        // Public Display
        display: function () {
           var displayArray = [];
                $(this.element).find('li').each(function(){
                    var li = $(this),
                        parentLi = li.parent() && li.parent().parent() ?  li.parent().parent() : null,
                        parentLiIsChecked = parentLi ? parentLi.children("input").prop("checked") : false;
                    if( !parentLiIsChecked && $(this).children("input").prop("checked") )                  
                        displayArray.push( $(this).children("label").text() );                    
                });
            return displayArray;
        },
        // Public Setter
        set: function (valuesArray) {

            this.clear();
            var el = this.element;

            $(valuesArray).each(function(){

                var $check = $(el).find('#checkbox-' + this);
                if( $check ) {					  					
					$container = $check.closest('li');
					$checkbox.prop("checked", true);
					checkChildren($container, true);
					checkParent($container, true);				   
				}                                
				else
                    return false;
            });
            return true;
        }
    };

    /*
     * Plugin wrapper, preventing against multiple instantiations and
     * allowing any public function to be called via the jQuery plugin,
     * e.g. $(element).pluginName('functionName', arg1, arg2, ...)
     */
    $.fn[ pluginName ] = function ( arg ) {

        var args, instance;

        // only allow the plugin to be instantiated once
        if (!( this.data( dataPlugin ) instanceof Plugin )) {

            // if no instance, create one
            this.data( dataPlugin, new Plugin( this ) );
        }

        instance = this.data( dataPlugin );
        instance.element = this;

        // Is the first parameter an object (arg), or was omitted,
        // call Plugin.init( arg )
        if ( typeof arg === 'undefined' || typeof arg === 'object' ) {

            if ( typeof instance['init'] === 'function' ) {
                instance.init( arg );
            }
            // checks that the requested public method exists
        } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {
            // copy arguments & remove function name
            args = Array.prototype.slice.call( arguments, 1 );
            // call the method
            return instance[arg].apply( instance, args );

        } else {
            $.error( 'Method ' + arg + ' does not exist on jQuery.' + pluginName );
        }
    };

}(jQuery, window, document));


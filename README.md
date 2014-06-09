# jQuery Simple TreePicker

Simple TreePicker is a jQuery plugin for creating tree selection controls. Some of its features include:

 * No images or dependencies other than jQuery
 * Clickable arrows for showing/hiding subtrees
 * Use of indeterminate state for semi-selected subtrees
 * Smart hierarchy logic for selecting parent/child nodes

![Tree Picker Preview](http://simpletreepicker.alexmeub.com/tree-preview.PNG)

You can find a live demo [here](http://simpletreepicker.alexmeub.com).

## Usage

First, include references to `jquery.simple-tree-picker.js` and `jquery.simple-tree-picker.css` in your page.

Then, call the plugin on an element. You must specify a `tree` property that is an object representing your tree. For now you must use the `Number`, `Name` and `Children` keys: `Number` is the element ID, `Name` is the display name and `Children` is the array of child objects. For example:

    var myTreeObject =
    {
        "Number": "KI-125-25",
        "Name": "Everything",
        "Children":
        [
            {
                "Number": "WA-775-99",
                "Name": "Upstairs",
                "Children":
                [
                    {
                        "Number": "JI-105-09",
                        "Name": "East Wing",
                        "Children": []
                    }
                ]
            },
            {
                "Number": "QQ-542-10",
                "Name": "Basement",
                "Children": []
            }
        ]
    };

    $('.myTreeDiv').simpleTreePicker( {
        "tree": myTreeObject
    } );


## Options

### Onclick

You can optionally specify an `onclick` function on initialization

    $('.myTreeDiv').simpleTreePicker( {
        "tree": myTreeObject,
		"onclick":function(){alert("clicked");}
    } );
	
### Selected

You can optionally specify a default tree selection on initialization
	
	$('.myTreeDiv').simpleTreePicker( {
        "tree": myTreeObject,
		"selected": ["JI-105-09", "QQ-542-10"]
    } );
 
### Name

You can optionally specify a name of the tree that will be applied as a class

	$('.myTreeDiv').simpleTreePicker( {
        "tree": myTreeObject,
		"name": "room-selection-tree"
    } );


## Other Methods

### Retrieve the IDs of the selected areas:

    $(".tree").simpleTreePicker("val");
    //example output: ["SS-002-99", "ZZ-493-66"]

### Retrieve the display names of selected areas:

    $(".tree").simpleTreePicker("display");
    //example output: ["Hello Service Area", "Yellow Service Area"]

### Select specific areas (accepts an array of area IDs):

    $(".tree").simpleTreePicker("set", ["SS-002-99", "ZZ-493-66"]);
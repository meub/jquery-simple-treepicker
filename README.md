simpleTreePicker
================

SimpleTreePicker is a jQuery plugin for creating nested tree controls. It uses the indeterminate state to show when parent areas have only some child areas selected.


Usage
=====

The plugin accepts a `tree` property that is JSON object representing your tree. For now you must use the `Number`, `Name` and `Children` keys. For example:


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
    }

Methods
====

Retrieve the IDs of the selected areas:

    $(".tree").simpleTreePicker("val");
    //example output: ["SS-002-99", "ZZ-493-66"]

Retrieve the display names of selected areas:

    $(".tree").simpleTreePicker("display");
    //example output: ["Hello Service Area", "Yellow Service Area"]

Select areas specific areas (accepts an array of area IDs):

    $(".tree").simpleTreePicker("set", ["SS-002-99", "ZZ-493-66"]);
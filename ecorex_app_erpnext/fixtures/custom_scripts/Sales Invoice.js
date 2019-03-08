frappe.ui.form.on("Sales Invoice", {
    onload: function(frm) {

    var dialog = new frappe.ui.Dialog({
    title: __("Send SMS"),
    fields: [
        {"fieldtype": "Data", "label": __("Please Enter  Mobile Number"), "fieldname": "mob_num",
            "reqd": 1 ,
        },
        {"fieldtype": "Text", "label": __("Message Box"), "fieldname": "msg_box",
            "reqd": 1 ,
        },
        {"fieldtype": "Button", "label": __("Send"), "fieldname": "update1"},
    ]
}); 
    dialog.fields_dict.update1.input.onclick = function() {
    var mob_num = $("input[data-fieldname='mob_num']").val(); 
    // var msg_box = $("input[text-fieldname='msg_box']").val(); 
    var values = dialog.get_values();


        frm.call({
          //    doc: frm.doc,
              args: { doctype: "Sales Invoice" , mob_num : mob_num , msg_box : values.msg_box },
              method: "ecorex_app_erpnext.hooks_call.sales_invoice.send_msg",
              callback: function(r) {
                // frm.clear_table("required_items")

          }
            }); 



    },

    dialog.show();
    if(frm.doc.po_no )
    {
    var j = "Dear Valued Customer, We have shipped your material by road via Vehicle No. "+frm.doc.vehicle_no+" (Driver's Name and Contact No. -"+frm.doc.makwiz_driver_name+") for your PO "+frm.doc.po_no +".List of materials is as follows: " ;
    }
    else{

        var j = "Dear Valued Customer, We have shipped your material by road via Vehicle No. "+frm.doc.vehicle_no+" (Driver's Name and Contact No. -"+frm.doc.makwiz_driver_name+") for your PO.List of materials is as follows: ";

    }

    $.each(frm.doc.items, function(index,row)
    {
        if(frm.doc.items.length != index+1 )
        {

            j = j + row.item_code +"  "+row.uom+"  "+row.qty +","

        }else 
           {

            j = j + row.item_code +"  "+row.uom+"  "+row.qty +".Thank you for your order."

        } 

    });
        frappe.call({
       "method": "frappe.client.get",
        args: {
            doctype: "Address",
            name: frm.doc.customer_address
        },
        callback: function(r) {
           if(r.message){
            dialog.set_value('mob_num', r.message.phone );

          }

        }
    });
    dialog.set_value('msg_box', j );

}

});

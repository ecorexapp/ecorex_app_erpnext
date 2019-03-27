frappe.ui.form.on("Sales Invoice", {
    refresh: function(frm) {
       
        if (frm.doc.docstatus==1  ) {
        if (frappe.user.has_role('SMS Alert Manager')){

        cur_frm.add_custom_button(__('Send SMS'), 
            function() { 

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
    var j = "Dear Valued Customer , We have shipped your material "


    $.each(frm.doc.items, function(index,row)
    {
        if(frm.doc.items.length != index+1 )
        {

            j = j + row.item_name +"  "+row.qty +","

        }else 
           {

            j = j + row.item_name +"  "+row.qty +"+" "+row.uom+" via vehicle number "+frm.doc.vehicle_no+" (Driver's Name and Contact No. -"+frm.doc.driver_name +") for your reference.Thank you for your order."

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
            dialog.set_value('mob_num', r.message.sms_alert_phone_no );

          }

        }
    });
    dialog.set_value('msg_box', j );




                
            },
           );
    

}
}



}

});


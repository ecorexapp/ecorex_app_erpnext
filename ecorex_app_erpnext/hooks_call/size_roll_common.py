from __future__ import unicode_literals
import frappe
from frappe.utils import flt, cstr, cint
from frappe import msgprint, _

@frappe.whitelist(allow_guest=True)
def validate_size_roll(self, method):
	if self.is_sample_order:
		if(len(self.items) > 1):
			frappe.throw(_("Only one Article can add in Item."))
		temp_size = []
		for s in self.get('size_roll'):
			temp_size.append(str(s.size_name))
		if len(temp_size) != len(set(temp_size)):
			frappe.throw(_("Same Size has been entered multiple times in Size Roll."))
		if(self.doctype == "Delivery Note"):
			sample_order_number = ''
			for item in self.get('items'):
				sample_order_number = item.against_sales_order
			sales_order_sizes = frappe.db.sql_list("""select distinct size_name 
			from `tabSales Order Size Roll` where `parent`= %s""", sample_order_number)
			if not check_size_in_sales_order(temp_size, sales_order_sizes):
				frappe.throw(_("Size not match with Size in Sales Order."))				

def check_size_in_sales_order(delivery_notes_sizes, sales_order_sizes):
	for size in delivery_notes_sizes:
		if size in sales_order_sizes:
			return True
		else:
			return False
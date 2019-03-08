from __future__ import unicode_literals
import frappe
from frappe.utils import flt, cstr, cint
from frappe import msgprint, _ ,throw
from frappe.core.doctype.sms_settings.sms_settings import send_sms





@frappe.whitelist(allow_guest=True)
def send_msg(doctype, mob_num , msg_box):
	mob_num_lst = [mob_num]
	send_sms(mob_num_lst,msg_box)

	

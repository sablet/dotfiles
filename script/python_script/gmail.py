#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-

"""
Gmail
Gmailで簡単にメール送信
"""
import sys
import datetime
import smtplib
from email import Encoders
from email.Utils import formatdate
from email.MIMEBase import MIMEBase
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText


#Gmailアカウント
#ADDRESS = "Gmailのアドレス"
#PASSWARD = "Gmailのパスワード"
ADDRESS = "e.typ719@gmail.com"
PASSWARD = "kghz8724"

#SMTPサーバの設定(Gmail用)
SMTP = "smtp.gmail.com"
PORT = 587

def create_message(from_addr, to_addr, subject, body, mime=None, attach_file=None):
    """
    メッセージを作成する
    @:param from_addr 差出人
    @:param to_addr 宛先
    @:param subject 件名
    @:param body 本文
    @:param mime MIME
    @:param attach_file 添付ファイル
    @:return メッセージ
    """
    msg = MIMEMultipart()
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg["Date"] = formatdate()
    msg["Subject"] = subject
    body = MIMEText(body)
    msg.attach(body)

    # 添付ファイル
    if mime != None and attach_file != None:
        attachment = MIMEBase(mime['type'],mime['subtype'])
        file = open(attach_file['path'])
        attachment.set_payload(file.read())
        file.close()
        Encoders.encode_base64(attachment)
        msg.attach(attachment)
        attachment.add_header("Content-Disposition","attachment", filename=attach_file['name'])

    return msg

def send(from_addr, to_addrs, msg):
    """
    メールを送信する
    @:param from_addr 差出人
    @:param to_addr 宛先(list)
    @:param msg メッセージ
    """
    smtpobj = smtplib.SMTP(SMTP, PORT)
    smtpobj.ehlo()
    smtpobj.starttls()
    smtpobj.ehlo()
    smtpobj.login(ADDRESS, PASSWARD)
    smtpobj.sendmail(from_addr, to_addrs, msg.as_string())
#    smtpobj.sendmail(from_addr, to_addrs, msg)
    smtpobj.close()


if __name__ == '__main__':
#def main_action(fname, fpath, subject):
    #宛先アドレス
    #to_addr = "宛先アドレス"
    to_addr = "e.typ719_paperwhite@kindle.com"
    #to_addr = "e.typ719@gmail.com"
    
    #件名と本文
    #    subject = "件名"
    #    body = "本文"
    subject = 'convert'
    body= ''

    #添付ファイル設定(text.txtファイルを添付)
    attach_file={'name':sys.argv[1], 'path':sys.argv[1]}

    mime={'type':'application', 'subtype':'pdf'}
    #attach_file={'name':fname, 'path':fpath}


    #メッセージの作成(添付ファイルあり)
    msg = create_message(ADDRESS, to_addr, subject, body, mime, attach_file)
    #msg = create_message(ADDRESS, to_addr, subject, body)
    
    #送信
    send(ADDRESS, [to_addr], msg)
    

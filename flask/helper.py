import sqlite3

DB_PATH = './db.db'
NOTSTARTED = 'Non iniziato'
INPROGRESS = 'In corso'
COMPLETED = 'Completato'

import json
import collections

def add_to_list(item):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('insert into items(item, status) values(?,?)', (item, NOTSTARTED))
        conn.commit()
        return {"todo": item, "stato": NOTSTARTED}
    except Exception as e:
        print('Errore: ', e)
        return None

def get_all_items():
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('select * from items')
        rows = c.fetchall()
        """
        rowarray_list = []
        for row in rows:
            t = (row[0], row[1], row[2])
            rowarray_list.append(t)
        respuesta = {"items" : rowarray_list}
        j = json.dumps(respuesta)
        """
        objects_list = []
        
        for row in rows:
            d = collections.OrderedDict()
            d['id'] = row[0]
            d['item'] = row[1]
            d['status'] = row[2]
            objects_list.append(d)

        respuesta = {"items" : objects_list}
        #j = json.dumps(respuesta)

        return respuesta
    except Exception as e:
        print('Errore: ', e)
        return None

def get_item(itemid):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("select id, item, status from items where id=%s" % itemid)
        rows = c.fetchall()
        rowCount = len(rows)
        conn.commit()

        if rowCount == 0:
            return None
            
        objects_list = []
        for row in rows:
            d = collections.OrderedDict()
            d['id'] = row[0]
            d['item'] = row[1]
            d['status'] = row[2]
            objects_list.append(d)
        return objects_list
    except Exception as e:
        print('Errore: ', e)
        return None

def update_status(itemid, status):
    # Check if the passed status is a valid value
    if (status.lower().strip() == 'non iniziato'):
        status = NOTSTARTED
    elif (status.lower().strip() == 'in corso'):
        status = INPROGRESS
    elif (status.lower().strip() == 'completato'):
        status = COMPLETED
    else:
        print("Invalid Status: " + status)
        respuesta = {"errore" : "Lo stato '" + status + "' non esiste. Le opzioni sono: '" + NOTSTARTED + "', '" + INPROGRESS + "' y '" + COMPLETED + "'." }
        return respuesta

    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('update items set status=? where id=?', (status, itemid))
        rowCount = c.rowcount
        conn.commit()
        if rowCount == 0:
            return {"errore" : "Il todo " + str(itemid) + " non esiste."}
        else:
            return {itemid: status}
    except Exception as e:
        print('Errore: ', e)
        return None

def delete_item(itemid):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('delete from items where id=?', (itemid,))
        rowCount = c.rowcount
        conn.commit()
        if rowCount == 0:
            return {"error" : "Il todo " + itemid + " non esiste."}
        else:
            return {"Todo": itemid}
    except Exception as e:
        print('Errore: ', e)
        return None
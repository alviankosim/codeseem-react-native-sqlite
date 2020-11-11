/**
 * CodeSeem SQLite React Native Application
 */
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'codeseem.db', createFromLocation: 1 }, () => {
  Alert.alert('Info', 'Sukses loading database SQLite');
}, (err) => {
  console.log(err)
})

const App = () => {
  const [value, setValue] = useState('');
  const [listData, setListData] = useState([]);

  const handleAddData = () => {
    if (value) {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO ms_user (user_fullname) VALUES (?);',
          [value],
          (txn, res) => {
            if (res.rowsAffected > 0) {
              let newListData = listData;
              let insertID = res.insertId;
              newListData.push({
                id: insertID, //memanfaatkan ID unique dari column user_id
                name: value
              });

              setListData(newListData);
              setValue("");
            }
          },
          (err) => {
            console.log(err);
          }
        )
      })
    } else {
      Alert.alert('Info', 'Mohon masukkan data yang benar!')
    }
  }

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ms_user;',
        [],
        (txn, res) => {
          if (res.rows.length > 0) {
            let count = res.rows.length;
            let newListData = [];

            for (let index = 0; index < count; index++) {
              const element = res.rows.item(index);
              newListData.push({
                id: element.user_id, //memanfaatkan value dari database, column user_id
                name: element.user_fullname //memanfaatkan value dari database, column user_fullname
              });
            }

            setListData(newListData);
          }
        },
        (err) => {
          console.log(err);
        }
      )
    })
  }, []);

  return (
    <View style={styles.container}>
      <Text>React Native SQLite</Text>
      <View style={styles.textInputWrapper}>
        <TextInput onChangeText={text => setValue(text)} value={value} placeholder="Masukkan data" style={styles.textInput} />
        <View style={{ margin: 10 }}>
          <Button onPress={handleAddData} title="Add Data" />
        </View>
      </View>
      <Text>List Data</Text>
      <ScrollView>
        {
          listData.map(item => {
            return <Text key={item.id}>{item.name}</Text>
          })
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  textInputWrapper: {
    flexDirection: 'row'
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'black'
  }
});

export default App;
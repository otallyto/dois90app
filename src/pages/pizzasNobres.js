import React, { Component } from "react";

import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import api from "../services/api";

import Page from "./page";

export default class PizzasNobres extends Component {
  static navigationOptions = {
    title: "Nobres"
  };

  state = {
    dados: [],
    refreshing: false
  };

  atualizarDados = () => {
    this.setState({ refreshing: true });
    this.fazerRequisicao();
    this.setState({ refreshing: false });
  };

  async fazerRequisicao() {
    try {
      const response = await api.get("/api/pizzasNobres");
      if (response.ok) {
        const dados = response.data;

        const value = await AsyncStorage.getItem("@pizzasNobres");

        await AsyncStorage.setItem("@auxNobres", JSON.stringify(dados));
        const auxNobres = await AsyncStorage.getItem("@auxNobres");

        if (value == null) {
          await AsyncStorage.setItem("@pizzasNobres", JSON.stringify(dados));
          this.setState({ dados: dados });
          alert("Dados atualizados");
        } else if (value.length != auxNobres.length) {
          await AsyncStorage.setItem("@pizzasNobres", JSON.stringify(dados));
          this.setState({ dados: dados });
          alert("Dados atualizados");
        } else {
          alert("Dados atualizados");
        }
      } else {
        alert("SEM INTERNET");
      }
    } catch (e) {
      // saving error
      alert(e);
    }
  }

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem("@pizzasNobres");
      if (value !== null) {
        this.setState({ dados: JSON.parse(value) });
      } else {
        try {
          this.fazerRequisicao();
        } catch (e) {
          // saving error
          alert(e);
        }
      }
    } catch (e) {
      // error reading value
      alert(e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Page />
        <FlatList
          data={this.state.dados}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.atualizarDados}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomColor: "#A5A5A5",
    borderBottomWidth: 1
  },
  text: {
    color: "#000000",
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  }
});

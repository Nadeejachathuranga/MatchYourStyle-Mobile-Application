import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const PUBLISHABLE_KEY =
  "pk_test_51O3x9tGEIOifpCgCb7gZFsyZcxDLpC7QMSSbR2xACG8A86KxZ6gLGikbU6DE7wwSI7TXJM9t8p32iNRRwnSwcqDs00bVgJdvQT";

const customAppearance = {
  shapes: {
    borderRadius: 12,
    borderWidth: 0.5,
  },
  primaryButton: {
    shapes: {
      borderRadius: 20,
    },
  },
  colors: {
    primary: "#E96E6E",
    background: "#ffffff",
    componentBackground: "#f3f8fa",
    componentBorder: "#000000",
    componentDivider: "#BBBBBB",
    primaryText: "#000000",
    secondaryText: "#000000",
    componentText: "#000000",
    placeholderText: "#73757b",
  },
};

const CheckoutScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const { totalPrice } = route.params;
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const fetchPaymentSheetParams = async () => {
    const response = await axios.post(
      "http://192.168.1.2:8070/payment/create-sheet",
      { totalPrice }
    );

    const { paymentIntent, ephemeralKey, customer } = await response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const paymentDetails = {
      merchantDisplayName: "Fashion, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Sanjula",
        email: "sdulshan10@gmail.com",
      },
      appearance: customAppearance,
    };

    const { error } = await initPaymentSheet(paymentDetails);

    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Order Failed",
        visibilityTime: 8000,
        autoHide: true,
        bottomOffset: 100,
      });
    } else {
      navigation.navigate("HOME");
    }
  };

  const handleInputChange = (name, value) => {
    setBillingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.form}>
            <Text style={styles.title}>Billing Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                value={billingDetails.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                value={billingDetails.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="johndoe@example.com"
                value={billingDetails.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main St"
                value={billingDetails.address}
                onChangeText={(text) => handleInputChange("address", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="New York"
                value={billingDetails.city}
                onChangeText={(text) => handleInputChange("city", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                placeholder="United States"
                value={billingDetails.country}
                onChangeText={(text) => handleInputChange("country", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 123 456 7890"
                value={billingDetails.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openPaymentSheet()}
              disabled={!loading}
            >
              <Text style={styles.buttonText}>Submit and Pay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#E96E6E",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;

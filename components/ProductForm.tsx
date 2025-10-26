import { Product, ProductInput } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: ProductInput) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  loading = false,
  isEdit = false,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [quantity, setQuantity] = useState(product?.quantity.toString() || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [imageUri, setImageUri] = useState(product?.image_uri || null);
  const theme = useTheme();

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    return cameraStatus === "granted" && mediaStatus === "granted";
  };

  const pickImage = async (useCamera: boolean) => {
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      Alert.alert(
        "Permission Required",
        "Please grant camera and media library permissions to add images."
      );
      return;
    }

    try {
      let result;

      if (useCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleImagePress = () => {
    Alert.alert("Add Image", "Choose an option", [
      { text: "Take Photo", onPress: () => pickImage(true) },
      { text: "Choose from Gallery", onPress: () => pickImage(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter a product name");
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      Alert.alert("Validation Error", "Please enter a valid quantity");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert("Validation Error", "Please enter a valid price");
      return;
    }

    onSubmit({
      name: name.trim(),
      quantity: quantityNum,
      price: priceNum,
      image_uri: imageUri,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Product Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        disabled={loading}
      />

      <TextInput
        label="Quantity *"
        value={quantity}
        onChangeText={setQuantity}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        disabled={loading}
      />

      <TextInput
        label="Price *"
        value={price}
        onChangeText={setPrice}
        mode="outlined"
        keyboardType="decimal-pad"
        left={<TextInput.Affix text="₦" />}
        style={styles.input}
        disabled={loading}
      />

      <View style={styles.imageSection}>
        <Text variant="bodyMedium" style={styles.imageLabel}>
          Product Image (Optional)
        </Text>

        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            <IconButton
              icon="close-circle"
              iconColor={theme.colors.error}
              size={32}
              onPress={handleRemoveImage}
              style={styles.removeButton}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.imagePlaceholder,
              { borderColor: theme.colors.outline },
            ]}
            onPress={handleImagePress}
            disabled={loading}
          >
            <IconButton
              icon="camera"
              size={48}
              iconColor={theme.colors.primary}
            />
            <Text variant="bodySmall" style={styles.placeholderText}>
              Tap to add image
            </Text>
          </TouchableOpacity>
        )}

        {imageUri && (
          <Button
            mode="outlined"
            onPress={handleImagePress}
            style={styles.changeImageButton}
            disabled={loading}
          >
            Change Image
          </Button>
        )}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        {isEdit ? "Update Product" : "Add Product"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  imageSection: {
    marginBottom: 16,
  },
  imageLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
    alignSelf: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  placeholderText: {
    marginTop: 8,
    opacity: 0.6,
  },
  changeImageButton: {
    marginTop: 12,
    alignSelf: "center",
  },
  submitButton: {
    marginTop: 8,
  },
});

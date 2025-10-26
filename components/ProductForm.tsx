import { Product, ProductInput } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const theme = useTheme();

  const [name, setName] = useState(product?.name || "");
  const [quantity, setQuantity] = useState(product?.quantity.toString() || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [imageUri, setImageUri] = useState(product?.image_uri || null);

  const [nameError, setNameError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    quantity: false,
    price: false,
  });

  // Validation helpers
  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Product name is required");
      return false;
    }
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateQuantity = (value: string) => {
    const num = parseInt(value);
    if (!value || isNaN(num)) {
      setQuantityError("Quantity is required");
      return false;
    }
    if (num < 0) {
      setQuantityError("Quantity cannot be negative");
      return false;
    }
    if (num === 0) {
      setQuantityError("Quantity must be at least 1");
      return false;
    }
    setQuantityError("");
    return true;
  };

  const validatePrice = (value: string) => {
    const num = parseFloat(value);
    if (!value || isNaN(num)) {
      setPriceError("Price is required");
      return false;
    }
    if (num < 0) {
      setPriceError("Price cannot be negative");
      return false;
    }
    if (num === 0) {
      setPriceError("Price must be greater than 0");
      return false;
    }
    setPriceError("");
    return true;
  };

  // Handlers with validation
  const handleNameChange = (value: string) => {
    setName(value);
    if (touched.name) validateName(value);
  };

  const handleQuantityChange = (value: string) => {
    // Only allow numbers
    const cleaned = value.replace(/[^0-9]/g, "");
    setQuantity(cleaned);
    if (touched.quantity) validateQuantity(cleaned);
  };

  const handlePriceChange = (value: string) => {
    // Allow numbers and single decimal point
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    const formatted =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;
    setPrice(formatted);
    if (touched.price) validatePrice(formatted);
  };

  const handleNameBlur = () => {
    setTouched({ ...touched, name: true });
    validateName(name);
  };

  const handleQuantityBlur = () => {
    setTouched({ ...touched, quantity: true });
    validateQuantity(quantity);
  };

  const handlePriceBlur = () => {
    setTouched({ ...touched, price: true });
    validatePrice(price);
  };

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
        "Camera and photo library access are needed to add product images.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleImagePress = () => {
    Alert.alert("Add Product Image", "Choose how to add your image", [
      {
        text: "📷 Take Photo",
        onPress: () => pickImage(true),
      },
      {
        text: "🖼️ Choose from Gallery",
        onPress: () => pickImage(false),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleRemoveImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setImageUri(null),
      },
    ]);
  };

  const handleSubmit = () => {
    // Mark all as touched
    setTouched({ name: true, quantity: true, price: true });

    // Validate all fields
    const isNameValid = validateName(name);
    const isQuantityValid = validateQuantity(quantity);
    const isPriceValid = validatePrice(price);

    if (!isNameValid || !isQuantityValid || !isPriceValid) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting"
      );
      return;
    }

    onSubmit({
      name: name.trim(),
      quantity: parseInt(quantity),
      price: parseFloat(price),
      image_uri: imageUri,
    });
  };

  const isFormValid =
    name.trim() &&
    !nameError &&
    quantity &&
    !quantityError &&
    price &&
    !priceError;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Product Name */}
          <View style={styles.inputGroup}>
            <TextInput
              label="Product Name"
              value={name}
              onChangeText={handleNameChange}
              onBlur={handleNameBlur}
              mode="outlined"
              style={styles.input}
              disabled={loading}
              error={touched.name && !!nameError}
              left={<TextInput.Icon icon="package-variant" />}
              placeholder="e.g., Wireless Mouse"
            />
            {touched.name && nameError ? (
              <HelperText type="error" visible={true}>
                {nameError}
              </HelperText>
            ) : (
              <HelperText type="info" visible={true}>
                Required
              </HelperText>
            )}
          </View>

          {/* Quantity and Price Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <TextInput
                label="Quantity"
                value={quantity}
                onChangeText={handleQuantityChange}
                onBlur={handleQuantityBlur}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
                disabled={loading}
                error={touched.quantity && !!quantityError}
                left={<TextInput.Icon icon="numeric" />}
                placeholder="0"
              />
              {touched.quantity && quantityError ? (
                <HelperText type="error" visible={true}>
                  {quantityError}
                </HelperText>
              ) : (
                <HelperText type="info" visible={true}>
                  Stock count
                </HelperText>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <TextInput
                label="Price"
                value={price}
                onChangeText={handlePriceChange}
                onBlur={handlePriceBlur}
                mode="outlined"
                keyboardType="decimal-pad"
                left={<TextInput.Affix text="₦" />}
                style={styles.input}
                disabled={loading}
                error={touched.price && !!priceError}
                placeholder="0.00"
              />
              {touched.price && priceError ? (
                <HelperText type="error" visible={true}>
                  {priceError}
                </HelperText>
              ) : (
                <HelperText type="info" visible={true}>
                  Per unit
                </HelperText>
              )}
            </View>
          </View>

          {/* Total Value Display */}
          {quantity && price && !quantityError && !priceError && (
            <View
              style={[
                styles.totalCard,
                { backgroundColor: theme.colors.inverseOnSurface },
              ]}
            >
              <Text variant="bodySmall" style={styles.totalLabel}>
                Total Inventory Value
              </Text>
              <Text
                variant="titleLarge"
                style={[styles.totalValue, { color: theme.colors.primary }]}
              >
                ₦
                {(parseFloat(price) * parseInt(quantity)).toLocaleString(
                  "en-NG",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </Text>
            </View>
          )}

          {/* Image Section */}
          <View style={styles.imageSection}>
            <View style={styles.imageSectionHeader}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Product Image
              </Text>
              <Text variant="labelSmall">Optional</Text>
            </View>

            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <IconButton
                  icon="close-circle"
                  iconColor="white"
                  containerColor={theme.colors.error}
                  size={24}
                  onPress={handleRemoveImage}
                  style={styles.removeButton}
                />
                <Button
                  mode="outlined"
                  onPress={handleImagePress}
                  style={styles.changeImageButton}
                  icon="camera-flip"
                  disabled={loading}
                >
                  Change Image
                </Button>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.imagePlaceholder,
                  {
                    borderColor: theme.colors.outline,
                    backgroundColor: theme.colors.surfaceVariant,
                  },
                ]}
                onPress={handleImagePress}
                disabled={loading}
                activeOpacity={0.7}
              >
                <IconButton
                  icon="camera-plus"
                  size={56}
                  iconColor={theme.colors.primary}
                />
                <Text variant="titleSmall" style={styles.placeholderTitle}>
                  Add Product Photo
                </Text>
                <Text variant="bodySmall" style={styles.placeholderText}>
                  Tap to take a photo or choose from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !isFormValid}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            icon={isEdit ? "check" : "plus"}
          >
            {isEdit ? "Update Product" : "Add Product"}
          </Button>

          {!isFormValid && (
            <Text variant="bodySmall" style={styles.formHint}>
              Fill all required fields to continue
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  halfWidth: {
    flex: 1,
  },
  totalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  totalLabel: {
    opacity: 0.8,
    marginBottom: 4,
  },
  totalValue: {
    fontWeight: "bold",
  },
  imageSection: {
    marginBottom: 24,
  },
  imageSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 16,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  changeImageButton: {
    marginTop: 12,
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholderTitle: {
    fontWeight: "600",
    marginTop: 8,
  },
  placeholderText: {
    marginTop: 4,
    opacity: 0.6,
    textAlign: "center",
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  formHint: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 12,
  },
});

import ProductForm from "@/components/ProductForm";
import { deleteProduct, getProductById, updateProduct } from "@/lib/db";
import { Product, ProductInput } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";

export default function ProductDetailScreen() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(Number(id));
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
      Alert.alert("Error", "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedProduct: ProductInput) => {
    if (!product) return;

    setSubmitting(true);
    try {
      await updateProduct({
        id: product.id,
        ...updatedProduct,
      });
      Alert.alert("Success", "Product updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Failed to update product:", error);
      Alert.alert("Error", "Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(Number(id));
              router.back();
            } catch (error) {
              console.error("Failed to delete product:", error);
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView>
        <ProductForm
          product={product}
          onSubmit={handleUpdate}
          loading={submitting}
          isEdit
        />
        <Button
          mode="contained"
          onPress={handleDelete}
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
          style={styles.deleteButton}
        >
          Delete Product
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    margin: 16,
  },
});

import ProductForm from "@/components/ProductForm";
import { deleteProduct, getProductById, updateProduct } from "@/lib/db";
import { Product, ProductInput } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  useTheme,
  Appbar,
  IconButton,
  Text,
  Portal,
  Dialog,
} from "react-native-paper";

export default function ProductDetailScreen() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(Number(id));
      
      if (!data) {
        Alert.alert(
          "Product Not Found",
          "This product may have been deleted.",
          [{ text: "OK", onPress: () => router.back() }]
        );
        return;
      }
      
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
      Alert.alert(
        "Error",
        "Failed to load product details. Please try again.",
        [
          { text: "Retry", onPress: loadProduct },
          { text: "Go Back", onPress: () => router.back() },
        ]
      );
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
      
      // Show success feedback
      Alert.alert(
        "✓ Product Updated",
        `"${updatedProduct.name}" has been updated successfully.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      Alert.alert(
        "Update Failed",
        "Unable to save changes. Please check your connection and try again.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: () => handleUpdate(updatedProduct) },
        ]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const showDeleteDialog = useCallback(() => {
    setDeleteDialogVisible(true);
  }, []);

  const hideDeleteDialog = useCallback(() => {
    setDeleteDialogVisible(false);
  }, []);

  const handleDelete = async () => {
    if (!product) return;

    setDeleting(true);
    hideDeleteDialog();

    try {
      await deleteProduct(Number(id));
      
      // Navigate back with success message
      router.back();
      
      // Show toast-style confirmation
      setTimeout(() => {
        Alert.alert("✓ Product Deleted", `"${product.name}" has been removed from inventory.`);
      }, 300);
    } catch (error) {
      console.error("Failed to delete product:", error);
      Alert.alert(
        "Delete Failed",
        "Unable to delete product. Please try again.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: handleDelete },
        ]
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleBackPress = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Keep Editing", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading product details...
          </Text>
        </View>
      </View>
    );
  }

  // Error state - product not found
  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centered}>
          <IconButton
            icon="package-variant-closed-remove"
            size={80}
            iconColor={theme.colors.outline}
          />
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Product Not Found
          </Text>
          <Text variant="bodyMedium" style={styles.errorText}>
            This product may have been deleted or doesn't exist.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={styles.errorButton}
            icon="arrow-left"
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Custom Header */}
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content title="Edit Product" />
        <Appbar.Action
          icon="delete-outline"
          onPress={showDeleteDialog}
          disabled={submitting || deleting}
        />
      </Appbar.Header>

      {/* Form */}
      <ProductForm
        product={product}
        onSubmit={handleUpdate}
        loading={submitting}
        isEdit
      />

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Icon icon="alert" size={48} />
          <Dialog.Title style={styles.dialogTitle}>Delete Product?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </Text>
            {product.quantity > 0 && (
              <View style={[styles.warningBox, { backgroundColor: theme.colors.errorContainer }]}>
                <IconButton
                  icon="alert-circle"
                  size={20}
                  iconColor={theme.colors.error}
                  style={styles.warningIcon}
                />
                <Text variant="bodySmall" style={{ color: theme.colors.onErrorContainer }}>
                  You have {product.quantity} unit{product.quantity !== 1 ? 's' : ''} in stock worth ₦
                  {(product.price * product.quantity).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog} disabled={deleting}>
              Cancel
            </Button>
            <Button
              onPress={handleDelete}
              loading={deleting}
              disabled={deleting}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Loading overlay for delete action */}
      {deleting && (
        <View style={styles.overlay}>
          <View style={[styles.overlayContent, { backgroundColor: theme.colors.surface }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="bodyLarge" style={styles.overlayText}>
              Deleting product...
            </Text>
          </View>
        </View>
      )}
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
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorTitle: {
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 150,
  },
  dialogTitle: {
    textAlign: "center",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  warningIcon: {
    margin: 0,
    marginRight: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    elevation: 8,
    minWidth: 200,
  },
  overlayText: {
    marginTop: 16,
  },
});
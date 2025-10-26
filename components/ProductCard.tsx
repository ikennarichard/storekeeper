import { Product } from "@/types";
import { Alert, StyleSheet, View } from "react-native";
import { Badge, Card, IconButton, Text, useTheme } from "react-native-paper";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onDelete: () => void;
}

export default function ProductCard({
  product,
  onPress,
  onDelete,
}: ProductCardProps) {
  const theme = useTheme();
  const isLowStock = product.quantity < 10;

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        {product.image_uri ? (
          <Card.Cover
            source={{ uri: product.image_uri }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text variant="titleLarge" style={styles.placeholderText}>
              {product.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.row}>
            <View style={styles.info}>
              <Text variant="bodySmall" style={styles.label}>
                Quantity
              </Text>
              <View style={styles.quantityRow}>
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.value,
                    isLowStock && { color: theme.colors.error },
                  ]}
                >
                  {product.quantity}
                </Text>
                {isLowStock && (
                  <Badge
                    size={20}
                    style={[
                      styles.badge,
                      { backgroundColor: theme.colors.errorContainer },
                    ]}
                  >
                    Low
                  </Badge>
                )}
              </View>
            </View>

            <View style={styles.info}>
              <Text variant="bodySmall" style={styles.label}>
                Price
              </Text>
              <Text
                variant="titleSmall"
                style={[styles.value, { color: theme.colors.primary }]}
              >
                ₦
                {product.price.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>

          <Text variant="bodySmall" style={styles.totalValue}>
            Total: ₦
            {(product.price * product.quantity).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <IconButton
          icon="delete-outline"
          iconColor={theme.colors.error}
          size={22}
          onPress={handleDeletePress}
          style={styles.deleteButton}
          accessibilityLabel={`Delete ${product.name}`}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  placeholderImage: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#757575",
    fontWeight: "bold",
  },
  details: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontWeight: "600",
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
  info: {
    flex: 1,
  },
  label: {
    opacity: 0.6,
    marginBottom: 4,
    fontSize: 12,
  },
  value: {
    fontWeight: "600",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    fontSize: 10,
  },
  totalValue: {
    opacity: 0.7,
    fontWeight: "500",
    marginTop: 4,
  },
  deleteButton: {
    margin: 0,
  },
});

import { Product } from "@/types";
import { Alert, StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

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
        {product.image_uri && (
          <Card.Cover
            source={{ uri: product.image_uri }}
            style={styles.image}
          />
        )}

        <View style={styles.details}>
          <Text variant="titleLarge" style={styles.name}>
            {product.name}
          </Text>

          <View style={styles.row}>
            <View style={styles.info}>
              <Text variant="bodySmall" style={styles.label}>
                Quantity
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {product.quantity}
              </Text>
            </View>

            <View style={styles.info}>
              <Text variant="bodySmall" style={styles.label}>
                Price
              </Text>
              <Text
                variant="bodyLarge"
                style={[styles.value, { color: theme.colors.primary }]}
              >
                ${product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <IconButton
          icon="delete"
          iconColor={theme.colors.error}
          size={24}
          onPress={handleDeletePress}
          style={styles.deleteButton}
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
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 24,
  },
  info: {
    flex: 1,
  },
  label: {
    opacity: 0.6,
    marginBottom: 2,
  },
  value: {
    fontWeight: "600",
  },
  deleteButton: {
    margin: 0,
  },
});

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ProductResponseDto } from './dtos/product.dto';
import { productData } from './mocks/products';

interface Product {
  price: number;
  name: string;
}

interface UpdateProduct {
  price?: number;
  name?: string;
  isDeleted?: boolean;
}

@Injectable()
export class ProductService {
  constructor() {}

  getAllProducts(): ProductResponseDto[] {
    try {
      const products = productData.map(
        (product) => new ProductResponseDto(product),
      );
      if (products) {
        return products;
      } else {
        throw new NotFoundException('Products not found');
      }
    } catch (error) {
      this.filterError(error.response);
    }
  }

  getProductsByIds(ids: string[]) {
    try {
      const filteredProductData = productData.filter((product) =>
        ids.includes(product.id),
      );
      if (filteredProductData.length === ids.length) {
        return filteredProductData;
      } else {
        throw new NotFoundException('One of the product Ids is not found');
      }
    } catch (error) {
      this.filterError(error.response);
    }
  }

  getProductById(id: string): ProductResponseDto {
    try {
      const productIndex = productData.findIndex(
        (product) => product.id === id,
      );
      if (productIndex !== -1) {
        const product = new ProductResponseDto(productData[productIndex]);
        return product;
      } else {
        throw new NotFoundException('Product Id is not found');
      }
    } catch (error) {
      this.filterError(error.response);
    }
  }

  softDeleteByIds(productIds) {
    try {
      productIds.forEach((id) => {
        if (id) {
          const productIndex = productData.findIndex(
            (product) => product.id === id,
          );
          if (productIndex !== -1) {
            productData[productIndex]['isDeleted'] = true;
            productData[productIndex] = {
              ...productData[productIndex],
              updated_at: new Date(),
            };
            const response = {
              statusCode: 200,
              message: 'Products Soft deleted successfully',
            };
            return response;
          } else {
            throw new NotFoundException('One of the product Ids is not found');
          }
        }
      });
    } catch (error) {
      this.filterError(error.response);
    }
  }

  upsertProduct(products, isDeleted): ProductResponseDto[] {
    try {
      let result = [];
      products.forEach((data) => {
        if (data.id) {
          const productIndex = productData.findIndex(
            (product) => product.id === data.id,
          );
          if (productIndex !== -1) {
            let updateProduct = this.updateProduct(
              productIndex,
              data,
              isDeleted,
            );
            result.push(updateProduct);
          } else {
            throw new NotFoundException('One of the product Ids is not found');
          }
        } else if (data.price && data.name) {
          let createProduct = this.createProduct(data);
          result.push(createProduct);
        } else {
          throw new NotFoundException('Missing mandatory fields');
        }
      });
      return result;
    } catch (error) {
      this.filterError(error.response);
    }
  }

  updateProduct(productIndex: number, data: ProductResponseDto, isDeleted) {
    data.isDeleted = isDeleted;
    productData[productIndex] = {
      ...productData[productIndex],
      ...data,
      updated_at: new Date(),
    };
    const product = new ProductResponseDto(productData[productIndex]);
    return product;
  }

  createProduct(data: ProductResponseDto) {
    const newProduct = this.createObject(data.price, data.name);
    productData.push(newProduct);
    const product = new ProductResponseDto(newProduct);
    return product;
  }

  createObject(price, name) {
    const newProduct = {
      id: uuid(),
      price,
      name,
      isDeleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return newProduct;
  }

  filterError(error) {
    console.log(error);
    
    if (error?.statusCode === 404) {
      throw new NotFoundException(error.message);
    } else {
      throw new HttpException('Internal Server Error', 400);
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { productData } from './mocks/products';
import {
  createProduct,
  createProductService,
  updateProduct,
  updateProductService,
} from './mocks/test-mocks';

describe('ReportService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should be return all products ', async () => {
      const productLength = productData.length;
      const res = await service.getAllProducts();
      const data = res.data;
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(res.isSuccess).toEqual(true);
      expect(Array.isArray(res.data)).toBeTruthy();
      expect(productLength).toEqual(data.length);
    });
  });

  describe('upsert Api', () => {
    // update product
    it('should be truthy or update the value ', async () => {
      const productLength = productData.length;
      const res = await service.upsertProduct(updateProduct, false);
      const latestProductLength = productData.length;
      const data = res.data[0];
      expect(Array.isArray(res.data)).toBeTruthy();
      expect(typeof data['isDeleted']).toEqual('boolean');
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(data['isDeleted']).toStrictEqual(false);
      expect(res.isSuccess).toEqual(true);
      expect(productLength).toStrictEqual(latestProductLength);
    });

    // create new product
    it('create a new product and push new record in product mock data', async () => {
      const productLength = productData.length;
      const res = await service.upsertProduct(createProduct, false);
      const data = res.data[0];
      const latestProductLength = productData.length;
      expect(Array.isArray(res.data)).toBeTruthy();
      expect(typeof data['isDeleted']).toEqual('boolean');
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(data['isDeleted']).toStrictEqual(false);
      expect(res.isSuccess).toEqual(true);
      expect(productLength).toBeLessThan(latestProductLength);
    });

    it('check update Product method', async () => {
      const res = await service.updateProduct(
        0,
        updateProductService[0],
        false,
      );
      expect(typeof res['isDeleted']).toEqual('boolean');
      expect(res['isDeleted']).toStrictEqual(false);
      expect(typeof res).toEqual('object');
    });

    it('check create Product method', async () => {
      const res = await service.createProduct(createProductService[0]);
      expect(typeof res['isDeleted']).toEqual('boolean');
      expect(res['isDeleted']).toStrictEqual(false);
      expect(typeof res).toEqual('object');
    });
  });

  describe('softDeleteByIds', () => {
    // product soft Delete By Ids             // positive scenario
    it('should be product deleted virtually or update the value of isDeleted ', async () => {
      const productLength = productData.length;
      const productId = updateProduct[0]['id'];
      const expectedMessage = 'Products Soft deleted successfully';
      const res = await service.softDeleteByIds([productId]);
      const latestProductLength = productData.length;
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(res.isSuccess).toEqual(true);
      expect(productLength).toStrictEqual(latestProductLength);
      expect(res.message).toContain(expectedMessage);
    });
  });

  describe('productsDetailsByIds', () => {
    // products Details By Ids             // positive scenario
    it('should be product deleted virtually or update the value of isDeleted ', async () => {
      const productId = updateProduct[0]['id'];
      const res = await service.getProductsByIds([productId]);
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(res.isSuccess).toEqual(true);
      expect(Array.isArray(res.data)).toBeTruthy();
    });
  });
});

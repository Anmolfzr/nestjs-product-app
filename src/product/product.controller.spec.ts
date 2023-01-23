import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { productData } from './mocks/products';
import { createProduct, updateProduct } from './mocks/test-mocks';
import { HttpException, NotFoundException } from '@nestjs/common';
import { devNull } from 'os';
import { UpdateProductDto } from './dtos/product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();
    service = module.get<ProductService>(ProductService);
    0.0;
    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    // products Details By Ids  // positive scenario
    it('should be return all products ', async () => {
      const productLength = productData.length;
      const res = await controller.getAllProducts();
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
      const res = await controller.upsertProduct(updateProduct);
      const latestProductLength = productData.length;
      const data = res.data[0];
      expect(Array.isArray(res.data)).toBeTruthy();
      expect(typeof data['isDeleted']).toEqual('boolean');
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(data['isDeleted']).toStrictEqual(false);
      expect(res.isSuccess).toEqual(true);
      expect(productLength).toStrictEqual(latestProductLength);
    });
    // fit('Http exception', () => {
    //   service.catch(
    //     new HttpException('Http exception', 322),
    //     'dtaa'
    // );
    // });
    // it('should be truthy or update the value ', async () => {
      // const productLength = productData.length;
      // const res = await controller.upsertProduct(updateProduct[0]);
      // console.log(res);
      // service.catch(
      //   new HttpException('Internal Server Error', 400),
      //   updateProduct[0],
      // );

      

      // const latestProductLength = productData.length;
      // const data = res.data[0];
      // expect(Array.isArray(res.data)).toBeTruthy();
      // expect(typeof data['isDeleted']).toEqual('boolean');
      // expect(typeof res.isSuccess).toEqual('boolean');
      // expect(data['isDeleted']).toStrictEqual(false);
      // expect(res.isSuccess).toEqual(true);
      // expect(productLength).toStrictEqual(latestProductLength);
    // });

    // fit('should return null when update', async (done) => {
    //   jest.spyOn(service, 'upsertProduct').mockResolvedValue(null)
    //   try {
    //     // await controller.updateById({ id: 'some id' }, {})
    //     await controller.upsertProduct(updateProduct[0]);
    //   } catch (error) {
    //     expect(error).toBeInstanceOf(NotFoundException);
    //     done();
    //   }
    // });

    fit('should return null when update', async () => {

      await expect(controller.upsertProduct([]))
      .rejects.toThrowError(NotFoundException);
    
    });

    it('should throw INTERNAL_SERVER_ERROR if user not update', async () => {
      const testuser =  new  UpdateProductDto();
      testuser.id = '123';
      // jest.spyOn(userservice, 'updateUser').mockRejectedValue(new Error('There was an error'));
      // await expect(usercontroller.updateUser(testuser)).rejects.toThrow(HttpException);
      // await expect(usercontroller.updateUser(testuser)).rejects.toThrow('There was an error');
    });

    // create new product
    it('create a new product and push new record in product mock data', async () => {
      const productLength = productData.length;
      const res = await controller.upsertProduct(createProduct);
      const data = res.data[0];
      const latestProductLength = productData.length;
      expect(Array.isArray(res.data)).toBeTruthy();
      expect(typeof data['isDeleted']).toEqual('boolean');
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(data['isDeleted']).toStrictEqual(false);
      expect(res.isSuccess).toEqual(true);
      expect(productLength).toBeLessThan(latestProductLength);
    });
  });

  describe('softDeleteByIds', () => {
    // product soft Delete By Ids             // positive scenario
    it('should be product deleted virtually or update the value of isDeleted ', async () => {
      const productLength = productData.length;
      const productId = updateProduct[0]['id'];
      const expectedMessage = 'Products Soft deleted successfully';
      const res = await controller.softDeleteByIds([productId]);
      const latestProductLength = productData.length;
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(res.isSuccess).toEqual(true);
      expect(productLength).toStrictEqual(latestProductLength);
      expect(res.message).toContain(expectedMessage);
    });
  });

  describe('productsDetailsByIds', () => {
    it('should be product deleted virtually or update the value of isDeleted ', async () => {
      const productId = updateProduct[0]['id'];
      const res = await controller.productsDetailsByIds([productId]);
      expect(typeof res.isSuccess).toEqual('boolean');
      expect(res.isSuccess).toEqual(true);
      expect(Array.isArray(res.data)).toBeTruthy();
    });
  });
});

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';

import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ProductResponseDto,
  UpdateProductDto,
  CreateProductDto,
} from './dtos/product.dto';
import { User, UserInfo } from 'src/user/decorators/user.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ description: 'Returns all the products' })
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: [
        {
          id: 'c520361a-8e76-4564-b0eb-737246fd922b',
          name: 'Chevrolet',
          price: 75000,
          isDeleted: false,
        },
        {
          id: 'aa50e9ae-246b-4955-8fa9-17218a5db945',
          name: 'Audi',
          price: 25000,
          isDeleted: false,
        },
      ],
    },
  })

  // // testing
  // @ApiResponse({
  //   description: 'Unauthorized Request',
  //   schema: {
  //     example: {
  //       statusCode: 401,
  //       message: 'Unauthorized',
  //     },
  //   },
  // })
  @ApiResponse({
    description: 'Internal server error',
    schema: {
      example: [
        {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      ],
    },
  })
  @Get('all')
  getAllProducts(@User() user: UserInfo) {
    console.log('details',user);

    return this.productService.getAllProducts();
  }

  //=======================================  

  @ApiOperation({
    description:
      'Accepts an array of productsIds and returns the array of products',
  })
  @ApiQuery({
    name: 'ids',
    description: 'Array of productIds',
    type: 'string[]',
    required: true,
    example: {
      url: 'http://localhost:3000/products/specifiedIds?ids=c520361a-8e76-4564-b0eb-737246fd922b',
    },
  })
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: [
        {
          id: 'c520361a-8e76-4564-b0eb-737246fd922b',
          name: 'puma',
          price: 7500,
          isDeleted: false,
        },
        {
          id: 'aa50e9ae-246b-4955-8fa9-17218a5db945',
          name: 'adidas',
          price: 2500,
          isDeleted: true,
        },
      ],
    },
  })
  // testing
  // @ApiResponse({
  //   description: 'Unauthorized Request',
  //   schema: {
  //     example: {
  //       statusCode: 401,
  //       message: 'Unauthorized',
  //     },
  //   },
  // })
  @ApiResponse({
    description: 'Internal server error',
    schema: {
      example: [
        {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      ],
    },
  })
  @Get('specifiedIds')
  productsDetailsByIds(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.productService.getProductsByIds(ids);
  }

  //=======================================

  @ApiOperation({ description: 'Returns details of specified product Id' })
  @ApiParam({
    name: 'id',
    description: 'productId',
    type: 'string',
    required: true,
    example: {
      url: 'http://localhost:3000/products/c520361a-8e76-4564-b0eb-737246fd922b',
    },
  })
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: {
        id: 'c520361a-8e76-4564-b0eb-737246fd922b',
        name: 'puma',
        price: 7500,
        isDeleted: false,
      },
    },
  })
  // testing
  // @ApiResponse({
  //   description: 'Unauthorized Request',
  //   schema: {
  //     example: {
  //       statusCode: 401,
  //       message: 'Unauthorized',
  //     },
  //   },
  // })
  @ApiResponse({
    description: 'Internal server error',
    schema: {
      example: [
        {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      ],
    },
  })
  @Get(':id')
  getProductById(@Param('id', ParseUUIDPipe) id: string): ProductResponseDto {
    return this.productService.getProductById(id);
  }

  //=======================================

  @ApiOperation({
    description:
      'Accepts an array of productsIds (including productId, name, price) and for each product, if it exists, updates the value and if doesnt exist inserts the product. If product already virtually deleted please restore and overwrite it',
  })
  @ApiBody({
    type: UpdateProductDto,
    description:
      'There are two request body, one is for Create Product and other is for update Product',
    examples: {
      a: {
        summary: 'Create Product',
        description:
          'For create product, name and price parameters will be send',
        value: [{ name: 'test', price: 1000 }] as CreateProductDto[],
      },
      b: {
        summary: 'Update Product',
        description: 'For update product, name, price and id',
        value: [
          {
            name: 'test',
            price: 1000,
            id: 'fa0259ab-f2c0-4bfa-806b-a9179eb51962',
          },
        ] as UpdateProductDto[],
      },
    },
  })
  /// Response Documentation
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: {
        id: 'fa0259ab-f2c0-4bfa-806b-a9179eb51962',
        price: 1000,
        name: 'test',
        isDeleted: false,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request Response',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad request',
      },
    },
  })
  @ApiResponse({
    description: 'Unauthorized Request',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Post()
  upsertProduct(@Body() body) {
    return this.productService.upsertProduct(body, false);
  }

  //==================================

  @ApiOperation({
    description:
      'Accepts an array of productsIds and soft deletes the array of product Ids',
  })
  @ApiQuery({
    name: 'ids',
    description: 'Array of productIds',
    type: 'string[]',
    required: true,
    example: {
      url: 'http://localhost:3000/products/delete?ids=c520361a-8e76-4564-b0eb-737246fd922b',
    },
  })
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: {
        statusCode: 200,
        message: 'Products Soft deleted successfully',
      },
    },
  })
  // // testing
  // // @ApiResponse({
  // //   description: 'Unauthorized Request',
  // //   schema: {
  // //     example: {
  // //       statusCode: 401,
  // //       message: 'Unauthorized',
  // //     },
  // //   },
  // // })
  @ApiResponse({
    description: 'Internal server error',
    schema: {
      example: [
        {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      ],
    },
  })
  @Put('delete')
  softDeleteByIds(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.productService.softDeleteByIds(ids);
  }
}

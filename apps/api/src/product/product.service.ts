import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../category/category.entity';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      minPrice,
      maxPrice,
    } = query;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      qb.andWhere('product.name LIKE :search OR product.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    if (minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(data: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
    if (!category) throw new NotFoundException(`Category ${data.categoryId} not found`);

    const product = this.productRepo.create({ ...data, category });
    return this.productRepo.save(product);
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
      if (!category) throw new NotFoundException(`Category ${data.categoryId} not found`);
      product.category = category;
    }
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}

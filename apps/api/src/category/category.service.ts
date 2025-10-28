import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(query: CategoryQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const qb = this.categoryRepo.createQueryBuilder('category').leftJoinAndSelect('category.products', 'product');

    if (search) {
      qb.andWhere('category.name LIKE :search OR category.description LIKE :search', {
        search: `%${search}%`,
      });
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

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  create(data: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    await this.categoryRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }
}

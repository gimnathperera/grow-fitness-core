import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CollectInfo,
  CollectInfoDocument,
} from './schemas/collect-info.schema';
import { CreateCollectInfoDto } from './dto/create-collect-info.dto';
import { UpdateCollectInfoDto } from './dto/update-collect-info.dto';
import { CollectInfoQueryDto } from './dto/collect-info-query.dto';

@Injectable()
export class CollectInfoService {
  constructor(
    @InjectModel(CollectInfo.name)
    private collectInfoModel: Model<CollectInfoDocument>
  ) {}

  async create(
    createCollectInfoDto: CreateCollectInfoDto
  ): Promise<CollectInfo> {
    const collectInfo = new this.collectInfoModel(createCollectInfoDto);
    return collectInfo.save();
  }

  async findAll(query: CollectInfoQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      planType,
      location,
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (planType) {
      filter.planType = { $regex: planType, $options: 'i' };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.collectInfoModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.collectInfoModel.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<CollectInfo> {
    const collectInfo = await this.collectInfoModel.findById(id).exec();
    if (!collectInfo) {
      throw new NotFoundException(`Collect info with ID ${id} not found`);
    }
    return collectInfo;
  }

  async update(
    id: string,
    updateCollectInfoDto: UpdateCollectInfoDto
  ): Promise<CollectInfo> {
    const collectInfo = await this.collectInfoModel
      .findByIdAndUpdate(id, updateCollectInfoDto, { new: true })
      .exec();

    if (!collectInfo) {
      throw new NotFoundException(`Collect info with ID ${id} not found`);
    }

    return collectInfo;
  }

  async remove(id: string): Promise<void> {
    const result = await this.collectInfoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Collect info with ID ${id} not found`);
    }
  }

  async getStats() {
    const total = await this.collectInfoModel.countDocuments();
    const pending = await this.collectInfoModel.countDocuments({
      status: 'pending',
    });
    const contacted = await this.collectInfoModel.countDocuments({
      status: 'contacted',
    });
    const converted = await this.collectInfoModel.countDocuments({
      status: 'converted',
    });
    const rejected = await this.collectInfoModel.countDocuments({
      status: 'rejected',
    });

    return {
      total,
      pending,
      contacted,
      converted,
      rejected,
    };
  }
}

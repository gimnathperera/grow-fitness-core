import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PageQueryDto } from '../../common/dto/page-query.dto';

export enum CollectInfoStatus {
  PENDING = 'pending',
  CONTACTED = 'contacted',
  CONVERTED = 'converted',
  REJECTED = 'rejected',
}

export class CollectInfoQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: CollectInfoStatus,
    example: CollectInfoStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(CollectInfoStatus)
  status?: CollectInfoStatus;

  @ApiPropertyOptional({
    description: 'Search by name, email, or location',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by plan type',
    example: 'Personal Training',
  })
  @IsOptional()
  @IsString()
  planType?: string;

  @ApiPropertyOptional({
    description: 'Filter by location',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  location?: string;
}

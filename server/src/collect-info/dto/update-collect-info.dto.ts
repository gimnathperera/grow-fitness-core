import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateCollectInfoDto {
  @ApiPropertyOptional({
    description: 'Full name of the person',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Location where the person is located',
    example: 'New York, NY',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  location?: string;

  @ApiPropertyOptional({
    description: 'Plan type they are interested in',
    example: 'Personal Training',
  })
  @IsOptional()
  @IsString()
  planType?: string;

  @ApiPropertyOptional({
    description: 'Status of the lead',
    example: 'contacted',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Interested in morning sessions',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Date when contacted',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  contactedAt?: Date;

  @ApiPropertyOptional({
    description: 'Date when converted to client',
    example: '2024-01-20T14:00:00Z',
  })
  @IsOptional()
  convertedAt?: Date;

  @ApiPropertyOptional({
    description: 'Date when rejected',
    example: '2024-01-18T16:00:00Z',
  })
  @IsOptional()
  rejectedAt?: Date;

  @ApiPropertyOptional({
    description: 'Reason for rejection',
    example: 'Not interested in our services',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCollectInfoDto {
  @ApiProperty({
    description: 'Full name of the person',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Location where the person is located',
    example: 'New York, NY',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  location: string;

  @ApiProperty({
    description: 'Plan type they are interested in',
    example: 'Personal Training',
  })
  @IsString()
  @IsNotEmpty()
  planType: string;
}

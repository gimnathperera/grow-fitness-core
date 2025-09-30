import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CollectInfoService } from './collect-info.service';
import { CreateCollectInfoDto } from './dto/create-collect-info.dto';
import { UpdateCollectInfoDto } from './dto/update-collect-info.dto';
import { CollectInfoQueryDto } from './dto/collect-info-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, Roles, UserRole } from '../common/guards/roles.guard';

@ApiTags('Collect Info')
@Controller('collect-info')
export class CollectInfoController {
  constructor(private readonly collectInfoService: CollectInfoService) {}

  @Post()
  @ApiOperation({ summary: 'Create collect info entry' })
  @ApiResponse({
    status: 201,
    description: 'Collect info created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  create(@Body() createCollectInfoDto: CreateCollectInfoDto) {
    return this.collectInfoService.create(createCollectInfoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: 'Get all collect info entries (Admin/Team only)' })
  @ApiResponse({
    status: 200,
    description: 'List of collect info entries',
  })
  findAll(@Query() query: CollectInfoQueryDto) {
    return this.collectInfoService.findAll(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: 'Get collect info statistics (Admin/Team only)' })
  @ApiResponse({
    status: 200,
    description: 'Collect info statistics',
  })
  getStats() {
    return this.collectInfoService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: 'Get collect info by ID (Admin/Team only)' })
  @ApiResponse({
    status: 200,
    description: 'Collect info entry found',
  })
  @ApiResponse({
    status: 404,
    description: 'Collect info not found',
  })
  findOne(@Param('id') id: string) {
    return this.collectInfoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: 'Update collect info entry (Admin/Team only)' })
  @ApiResponse({
    status: 200,
    description: 'Collect info updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Collect info not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateCollectInfoDto: UpdateCollectInfoDto
  ) {
    return this.collectInfoService.update(id, updateCollectInfoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete collect info entry (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Collect info deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Collect info not found',
  })
  remove(@Param('id') id: string) {
    return this.collectInfoService.remove(id);
  }
}

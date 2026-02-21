import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully.', type: Payment })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get('kid/:kidId')
  @ApiOperation({ summary: 'Get all payments for a specific kid' })
  @ApiResponse({ status: 200, description: 'List of payments', type: [Payment] })
  async findAllByKid(@Param('kidId') kidId: string) {
    return this.paymentsService.findAllByKid(kidId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({ status: 200, description: 'The payment', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }

  @Get('summary/:kidId')
  @ApiOperation({ summary: 'Get payment summary for a kid' })
  @ApiResponse({ status: 200, description: 'Payment summary' })
  async getPaymentSummary(@Param('kidId') kidId: string) {
    return this.paymentsService.getPaymentSummary(kidId);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ClientsService } from "./clients.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard, Roles, UserRole } from "../common/guards/roles.guard";
import { PageQueryDto } from "../common/dto/page-query.dto";
import {
  CreateClientDto,
  UpdateClientDto,
  AssignCoachDto,
} from "./dto/client.dto";
import { SuccessResponseDto } from "../common/dto/response.dto";

@ApiTags("Clients")
@Controller("clients")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  // ---------------- CREATE CLIENT ----------------
  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: "Create a new client profile" })
  @ApiResponse({ status: 201, description: "Client created successfully" })
  async create(
    @Body() createClientDto: CreateClientDto
  ): Promise<SuccessResponseDto<any>> {
    const client = await this.clientsService.create(createClientDto);
    return {
      ok: true,
      data: client,
      meta: { traceId: "create-client", timestamp: new Date().toISOString() },
    };
  }

  // ---------------- GET ALL CLIENTS ----------------
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.COACH)
  @ApiOperation({ summary: "Get all clients" })
  @ApiResponse({ status: 200, description: "Clients retrieved successfully" })
  @ApiQuery({ name: "assignedCoachId", required: false })
  @ApiQuery({ name: "tags", required: false, type: [String] })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async findAll(
    @Query()
    query: PageQueryDto & {
      assignedCoachId?: string;
      tags?: string[];
      status?: string;
    }
  ): Promise<
    SuccessResponseDto<{ clients: any[]; total: number; pagination: any }>
  > {
    const { clients, total } = await this.clientsService.findAll({
      assignedCoachId: query.assignedCoachId,
      tags: query.tags,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    const totalPages = Math.ceil(total / (query.limit || 20));

    return {
      ok: true,
      data: {
        clients,
        total,
        pagination: {
          page: query.page || 1,
          limit: query.limit || 20,
          total,
          totalPages,
        },
      },
      meta: {
        traceId: "get-clients",
        timestamp: new Date().toISOString(),
        pagination: {
          page: query.page || 1,
          limit: query.limit || 20,
          total,
          totalPages,
        },
      },
    };
  }

  // ---------------- GET CURRENT CLIENT PROFILE ----------------
  @Get("my-profile")
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: "Get current client profile (auto-create if missing)" })
  @ApiResponse({ status: 200, description: "Client profile retrieved successfully" })
  async getMyProfile(@Request() req): Promise<SuccessResponseDto<any>> {
    const userId = req.user.sub; // JWT user ID as string
    let client = await this.clientsService.findByUserId(userId);

    // ✅ Auto-create profile if missing
    if (!client) {
      client = await this.clientsService.create({
        userId,
        // Optional: prefill defaults from req.user if available
        name: req.user.name || "",
        email: req.user.email || "",
      });
    }

    return {
      ok: true,
      data: client,
      meta: { traceId: "get-my-profile", timestamp: new Date().toISOString() },
    };
  }

  // ---------------- UPDATE CURRENT CLIENT PROFILE ----------------
  @Patch("my-profile")
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: "Update current client's profile" })
  @ApiResponse({ status: 200, description: "Client profile updated successfully" })
  async updateMyProfile(
    @Request() req,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<SuccessResponseDto<any>> {
    const userId = req.user.sub;
    let client = await this.clientsService.findByUserId(userId);

    // ✅ Auto-create if missing (ensures every logged client has a record)
    if (!client) {
      client = await this.clientsService.create({
        userId,
        name: req.user.name || "",
        email: req.user.email || "",
      });
    }

    const updatedClient = await this.clientsService.update(
      client._id.toString(),
      updateClientDto
    );

    return {
      ok: true,
      data: updatedClient,
      meta: {
        traceId: `update-my-client-profile-${userId}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // ---------------- GET CLIENT BY ID ----------------
  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.COACH, UserRole.CLIENT)
  @ApiOperation({ summary: "Get client by ID" })
  async findOne(@Param("id") id: string, @Request() req): Promise<SuccessResponseDto<any>> {
    if (req.user.role === UserRole.CLIENT) {
      const client = await this.clientsService.findByUserId(req.user.sub);
      if (!client || client._id.toString() !== id) {
        throw new ForbiddenException("Access denied");
      }
    }

    const client = await this.clientsService.findById(id);
    if (!client) {
      throw new NotFoundException("Client not found");
    }

    return {
      ok: true,
      data: client,
      meta: { traceId: "get-client", timestamp: new Date().toISOString() },
    };
  }

  // ---------------- UPDATE CLIENT ----------------
  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.CLIENT)
  @ApiOperation({ summary: "Update client" })
  async update(
    @Param("id") id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req
  ): Promise<SuccessResponseDto<any>> {
    if (req.user.role === UserRole.CLIENT) {
      const client = await this.clientsService.findByUserId(req.user.sub);
      if (!client || client._id.toString() !== id) {
        throw new ForbiddenException("Access denied");
      }
    }

    const client = await this.clientsService.update(id, updateClientDto);
    if (!client) throw new NotFoundException("Client not found");

    return {
      ok: true,
      data: client,
      meta: { traceId: "update-client", timestamp: new Date().toISOString() },
    };
  }

  // ---------------- ASSIGN COACH ----------------
  @Post("assign-coach")
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: "Assign coach to client" })
  async assignCoach(
    @Body() assignCoachDto: AssignCoachDto
  ): Promise<SuccessResponseDto<any>> {
    const client = await this.clientsService.assignCoach(
      assignCoachDto.clientId,
      assignCoachDto.coachId
    );

    if (!client) throw new NotFoundException("Client not found for coach assignment");

    return {
      ok: true,
      data: client,
      meta: { traceId: "assign-coach", timestamp: new Date().toISOString() },
    };
  }

  // ---------------- DELETE CLIENT ----------------
  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: "Delete client" })
  async remove(@Param("id") id: string): Promise<SuccessResponseDto<null>> {
    await this.clientsService.delete(id);

    return {
      ok: true,
      data: null,
      meta: { traceId: "delete-client", timestamp: new Date().toISOString() },
    };
  }
}

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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { CoachesService } from "./coaches.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard, Roles, UserRole } from "../common/guards/roles.guard";
import { PageQueryDto } from "../common/dto/page-query.dto";
import { CreateCoachDto, UpdateCoachDto } from "./dto/coach.dto";
import { SuccessResponseDto } from "../common/dto/response.dto";

@ApiTags("Coaches")
@Controller("coaches")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CoachesController {
  constructor(private coachesService: CoachesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: "Create a new coach profile" })
  @ApiResponse({
    status: 201,
    description: "Coach created successfully",
  })
  async create(
    @Body() createCoachDto: CreateCoachDto
  ): Promise<SuccessResponseDto<any>> {
    const coach = await this.coachesService.create(createCoachDto);
    return {
      ok: true,
      data: coach,
      meta: {
        traceId: "create-coach",
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post("my-profile")
  @Roles(UserRole.COACH)
  @ApiOperation({ summary: "Create coach profile" })
  @ApiResponse({
    status: 201,
    description: "Coach profile created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Coach profile already exists",
  })
  async createMyProfile(
    @Request() req,
    @Body() createCoachDto: CreateCoachDto
  ): Promise<SuccessResponseDto<any>> {
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const existingCoach = await this.coachesService.findByUserId(userId);
    if (existingCoach) {
      throw new Error('Coach profile already exists');
    }

    const coach = await this.coachesService.create({
      ...createCoachDto,
      userId,
      status: 'active', // default status
    });

    return {
      ok: true,
      data: coach,
      meta: {
        traceId: `create-my-coach-profile-${userId}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.CLIENT)
  @ApiOperation({ summary: "Get all coaches" })
  @ApiResponse({
    status: 200,
    description: "Coaches retrieved successfully",
  })
  @ApiQuery({ name: "specialties", required: false, type: [String] })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "acceptingNewClients", required: false, type: Boolean })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async findAll(
    @Query()
    query: PageQueryDto & {
      specialties?: string[];
      status?: string;
      acceptingNewClients?: boolean;
    }
  ): Promise<
    SuccessResponseDto<{ coaches: any[]; total: number; pagination: any }>
  > {
    const { coaches, total } = await this.coachesService.findAll({
      specialties: query.specialties,
      status: query.status,
      acceptingNewClients: query.acceptingNewClients,
      page: query.page,
      limit: query.limit,
    });

    const totalPages = Math.ceil(total / (query.limit || 20));

    return {
      ok: true,
      data: {
        coaches,
        total,
        pagination: {
          page: query.page || 1,
          limit: query.limit || 20,
          total,
          totalPages,
        },
      },
      meta: {
        traceId: "get-coaches",
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

  @Get("available")
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.CLIENT)
  @ApiOperation({ summary: "Get available coaches" })
  @ApiResponse({
    status: 200,
    description: "Available coaches retrieved successfully",
  })
  @ApiQuery({ name: "specialties", required: false, type: [String] })
  @ApiQuery({ name: "timeSlot", required: false })
  @ApiQuery({ name: "date", required: false })
  async getAvailableCoaches(
    @Query() query: { specialties?: string[]; timeSlot?: string; date?: string }
  ): Promise<SuccessResponseDto<any[]>> {
    const coaches = await this.coachesService.getAvailableCoaches({
      specialties: query.specialties,
      timeSlot: query.timeSlot,
      date: query.date,
    });

    return {
      ok: true,
      data: coaches,
      meta: {
        traceId: "get-available-coaches",
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get("my-profile")
  @Roles(UserRole.COACH)
  @ApiOperation({ summary: "Get current coach profile" })
  @ApiResponse({
    status: 200,
    description: "Coach profile retrieved successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Coach profile not found",
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async getMyProfile(@Request() req): Promise<SuccessResponseDto<any>> {
    const userId = req.user?.sub;
    if (!userId) {
      console.error('[Coaches] No user ID found in request');
      throw new Error('User ID not found in request');
    }

    console.log('[Coaches] Getting profile for user ID:', userId);

    try {
      console.log('[Coaches] User object:', JSON.stringify(req.user, null, 2));
      
      const coach = await this.coachesService.findByUserId(userId);
      
      if (!coach) {
        const errorMessage = `Coach profile not found for user ID: ${userId}`;
        console.log(`[Coaches] ${errorMessage}`);
        return {
          ok: true,
          data: null,
          meta: {
            traceId: `get-my-profile-${userId}`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      const coachInfo = {
        id: coach._id,
        userId: coach.userId,
        hasUserInfo: !!coach.userId,
        specialties: coach.specialties,
        status: coach.status
      };
      console.log('[Coaches] Found coach profile:', coachInfo);
      
      return {
        ok: true,
        data: coach,
        meta: {
          traceId: `get-my-profile-${userId}`,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('[Coaches] Error in getMyProfile:', {
        message: error.message,
        stack: error.stack,
        userId,
        timestamp: new Date().toISOString()
      });
      throw new Error(`Failed to fetch coach profile: ${error.message}`);
    }
  }

  @Patch("my-profile")
  @Roles(UserRole.COACH)
  @ApiOperation({ summary: "Update current coach's profile" })
  @ApiResponse({
    status: 200,
    description: "Coach profile updated successfully",
  })
  async updateMyProfile(
    @Request() req,
    @Body() updateCoachDto: UpdateCoachDto
  ): Promise<SuccessResponseDto<any>> {
    const coach = await this.coachesService.findByUserId(req.user.sub);
    if (!coach) {
      throw new Error("Coach profile not found");
    }

    const updatedCoach = await this.coachesService.update(
      coach._id.toString(),
      updateCoachDto
    );

    return {
      ok: true,
      data: updatedCoach,
      meta: {
        traceId: `update-my-coach-profile-${req.user.sub}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.COACH, UserRole.CLIENT)
  @ApiOperation({ summary: "Get coach by ID" })
  @ApiResponse({
    status: 200,
    description: "Coach retrieved successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Coach not found",
  })
  async findOne(
    @Param("id") id: string,
    @Request() req
  ): Promise<SuccessResponseDto<any>> {
    if (req.user.role === UserRole.COACH) {
      const coach = await this.coachesService.findByUserId(req.user.sub);
      if (!coach || coach._id.toString() !== id) {
        throw new Error("Access denied");
      }
    }

    const coach = await this.coachesService.findById(id);
    if (!coach) {
      throw new Error("Coach not found");
    }

    return {
      ok: true,
      data: coach,
      meta: {
        traceId: "get-coach",
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(":id/stats")
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.COACH)
  @ApiOperation({ summary: "Get coach statistics" })
  @ApiResponse({
    status: 200,
    description: "Coach statistics retrieved successfully",
  })
  async getCoachStats(
    @Param("id") id: string,
    @Request() req
  ): Promise<SuccessResponseDto<any>> {
    if (req.user.role === UserRole.COACH) {
      const coach = await this.coachesService.findByUserId(req.user.sub);
      if (!coach || coach._id.toString() !== id) {
        throw new Error("Access denied");
      }
    }

    const stats = await this.coachesService.getCoachStats(id);
    return {
      ok: true,
      data: stats,
      meta: {
        traceId: "get-coach-stats",
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.TEAM, UserRole.COACH)
  @ApiOperation({ summary: "Update coach" })
  @ApiResponse({
    status: 200,
    description: "Coach updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Coach not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCoachDto: UpdateCoachDto,
    @Request() req
  ): Promise<SuccessResponseDto<any>> {
    if (req.user.role === UserRole.COACH) {
      const coach = await this.coachesService.findByUserId(req.user.sub);
      if (!coach || coach._id.toString() !== id) {
        throw new Error("Access denied");
      }
    }

    const coach = await this.coachesService.update(id, updateCoachDto);
    return {
      ok: true,
      data: coach,
      meta: {
        traceId: "update-coach",
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.TEAM)
  @ApiOperation({ summary: "Delete coach" })
  @ApiResponse({
    status: 200,
    description: "Coach deleted successfully",
  })
  async remove(@Param("id") id: string): Promise<SuccessResponseDto<null>> {
    await this.coachesService.delete(id);
    return {
      ok: true,
      data: null,
      meta: {
        traceId: "delete-coach",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Client, ClientDocument } from "./schemas/client.schema";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { ErrorCodes } from "../shared/error-codes";

// Interfaces for populated fields
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  profilePic?: string;
}

interface PopulatedKid {
  _id: string;
  id: string;
  name: string;
  age?: number;
  sessionType?: string;
  gender?: string;
  location?: string;
  paymentStatus?: string;
}

interface PopulatedInvoice {
  _id: string;
  id: string;
  date: Date;
  amount: number;
  status: string;
  kidName: string;
}

interface ClientProfile extends Partial<ClientDocument> {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  profilePic?: string;
  kids?: PopulatedKid[];
  invoices?: PopulatedInvoice[];
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>
  ) {}

  // Create a new client
  async create(createClientDto: CreateClientDto): Promise<ClientDocument> {
    const existingClient = await this.clientModel.findOne({
      userId: createClientDto.userId,
    });

    if (existingClient) {
      throw new ConflictException({
        errorCode: ErrorCodes.RESOURCE_ALREADY_EXISTS,
        message: "Client profile already exists for this user",
      });
    }

    const client = new this.clientModel(createClientDto);
    return client.save();
  }

  // Get all clients with optional filters
  async findAll(
    filters: {
      assignedCoachId?: string;
      tags?: string[];
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ clients: ClientDocument[]; total: number }> {
    const { assignedCoachId, tags, status, page = 1, limit = 20 } = filters;

    const query: any = {};
    if (assignedCoachId) query.assignedCoachId = assignedCoachId;
    if (status) query.status = status;
    if (tags && tags.length > 0) query.tags = { $in: tags };

    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      this.clientModel
        .find(query)
        .populate("userId", "name email phone location profilePic")
        .populate("assignedCoachId", "userId specialties")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.clientModel.countDocuments(query),
    ]);

    return { clients, total };
  }

  // Get client by ID
  async findById(id: string): Promise<ClientDocument | null> {
    return this.clientModel
      .findById(id)
      .populate("userId", "name email phone location profilePic")
      .populate("assignedCoachId", "userId specialties");
  }

  // Get client by User ID
  async findByUserId(userId: string): Promise<ClientDocument | null> {
    return this.clientModel
      .findOne({ userId })
      .populate("userId", "name email phone location profilePic")
      .populate("assignedCoachId", "userId specialties");
  }

  // Update client
  async update(
    id: string,
    updateClientDto: UpdateClientDto
  ): Promise<ClientDocument> {
    const client = await this.clientModel
      .findByIdAndUpdate(id, updateClientDto, {
        new: true,
        runValidators: true,
      })
      .populate("userId", "name email phone location profilePic")
      .populate("assignedCoachId", "userId specialties");

    if (!client) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
        message: "Client not found",
      });
    }

    return client;
  }

  // Assign coach to client
  async assignCoach(clientId: string, coachId: string): Promise<ClientDocument> {
    const client = await this.clientModel
      .findByIdAndUpdate(
        clientId,
        { assignedCoachId: coachId },
        { new: true, runValidators: true }
      )
      .populate("userId", "name email phone location profilePic")
      .populate("assignedCoachId", "userId specialties");

    if (!client) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
        message: "Client not found",
      });
    }

    return client;
  }

  // Remove coach from client
  async removeCoach(clientId: string): Promise<ClientDocument> {
    const client = await this.clientModel
      .findByIdAndUpdate(
        clientId,
        { $unset: { assignedCoachId: 1 } },
        { new: true, runValidators: true }
      )
      .populate("userId", "name email phone location profilePic")
      .populate("assignedCoachId", "userId specialties");

    if (!client) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
        message: "Client not found",
      });
    }

    return client;
  }

  // Delete client
  async delete(id: string): Promise<void> {
    const result = await this.clientModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
        message: "Client not found",
      });
    }
  }

  // Get clients by coach ID
  async getClientsByCoach(
    coachId: string,
    page = 1,
    limit = 20
  ): Promise<{ clients: ClientDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      this.clientModel
        .find({ assignedCoachId: coachId })
        .populate("userId", "name email phone location profilePic")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.clientModel.countDocuments({ assignedCoachId: coachId }),
    ]);

    return { clients, total };
  }

  // --- Get my client profile for frontend ---
  async getMyClientProfile(userId: string): Promise<ClientProfile> {
    const client = await this.clientModel
      .findOne({ userId })
      .populate({
        path: "userId",
        select: "name email phone location profilePic",
      })
      .populate({
        path: "kids",
        select: "name age sessionType gender location paymentStatus",
      })
      .populate({
        path: "invoices",
        select: "date amount status kidName",
      })
      .lean()
      .exec();

    if (!client) {
      throw new NotFoundException({
        errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
        message: "Client profile not found",
      });
    }

    // Safe typing for userId
    const userData: PopulatedUser =
      client.userId && typeof client.userId !== "string" && "_id" in client.userId
        ? {
            _id: client.userId._id?.toString() || "",
            name: (client.userId as any).name || "",
            email: (client.userId as any).email || "",
            phone: (client.userId as any).phone || "",
            location: (client.userId as any).location || "",
            profilePic: (client.userId as any).profilePic || "",
          }
        : {
            _id: "",
            name: "",
            email: "",
            phone: "",
            location: "",
            profilePic: ""
          };

    // Type assertions for populated fields
    const populatedKids = (client.kids as unknown as Array<{
      _id: any;
      name: string;
      age?: number;
      sessionType?: string;
      gender?: string;
      location?: string;
      paymentStatus?: string;
    }> || []);

    const populatedInvoices = (client.invoices as unknown as Array<{
      _id: any;
      date: Date;
      amount: number;
      status: string;
      kidName: string;
    }> || []);

    // Map the kids and invoices to match the expected types
    const kids: PopulatedKid[] = populatedKids.map(kid => ({
      _id: kid._id?.toString() || '',
      id: kid._id?.toString() || '',
      name: kid.name || '',
      age: kid.age,
      sessionType: kid.sessionType,
      gender: kid.gender,
      location: kid.location,
      paymentStatus: kid.paymentStatus
    }));

    const invoices: PopulatedInvoice[] = populatedInvoices.map(invoice => ({
      _id: invoice._id?.toString() || '',
      id: invoice._id?.toString() || '',
      date: invoice.date,
      amount: invoice.amount,
      status: invoice.status,
      kidName: invoice.kidName
    }));

    return {
      _id: client._id.toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      profilePic: userData.profilePic,
      kids,
      invoices
    };
  }
}

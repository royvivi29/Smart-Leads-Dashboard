import { Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { AppError } from '../utils/AppError';
import { AuthRequest, ApiResponse, LeadQueryParams, ILead } from '../types';
import { FilterQuery } from 'mongoose';

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sortBy = 'latest',
    } = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter: FilterQuery<ILead> = {};

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    const sortDirection = sortBy === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const response: ApiResponse = {
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: lead,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user!.id,
    });

    const populated = await lead.populate('createdBy', 'name email');

    const response: ApiResponse = {
      success: true,
      data: populated,
      message: 'Lead created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .lean();

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: lead,
      message: 'Lead updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Lead deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCsv = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQueryParams;

    const filter: FilterQuery<ILead> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .lean();

    const headers = ['Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'];
    const rows = leads.map((lead) => {
      const createdBy = lead.createdBy as unknown as { name: string; email: string };
      return [
        `"${lead.name}"`,
        `"${lead.email}"`,
        lead.status,
        lead.source,
        `"${createdBy?.name || 'N/A'}"`,
        new Date(lead.createdAt).toISOString(),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

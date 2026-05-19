import { Request, Response } from 'express';
import Lead from '../models/Lead';

// Get leads with pagination, filtering, search, and sorting
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { search, status, source, sort } = req.query;

    const query: any = {};

    // Filtering
    if (status) query.status = status;
    if (source) query.source = source;

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption: any = { createdAt: -1 }; // Latest default
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query).sort(sortOption).skip(skip).limit(limit);

    res.status(200).json({
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get single lead
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Create lead
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: (error as Error).message });
  }
};

// Update lead
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: (error as Error).message });
  }
};

// Delete lead
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Export CSV
export const exportLeadsCsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();

    // Create CSV header
    let csvContent = 'Name,Email,Status,Source,CreatedAt\n';

    // Map rows
    leads.forEach(lead => {
      const row = [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${lead.createdAt.toISOString()}"`
      ].join(',');
      csvContent += row + '\n';
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

import { ServiceConfig, MCPRequest, MCPResponse, User } from './types';
import { prisma } from './db';

export const SERVICES: Record<string, ServiceConfig> = {
  // General service - no subscription required
  'list_services': {
    name: 'List Services',
    description: 'List all available government services',
    creditsRequired: 0,
    requiresSubscription: false,
    category: 'general',
  },
  
  // NTSA Services - require subscription
  'ntsa_driving_license_renewal': {
    name: 'Driving License Renewal',
    description: 'Renew your driving license',
    creditsRequired: 5,
    requiresSubscription: true,
    category: 'ntsa',
  },
  'ntsa_vehicle_registration': {
    name: 'Vehicle Registration',
    description: 'Register a new vehicle',
    creditsRequired: 10,
    requiresSubscription: true,
    category: 'ntsa',
  },
  'ntsa_logbook_replacement': {
    name: 'Logbook Replacement',
    description: 'Replace lost or damaged logbook',
    creditsRequired: 7,
    requiresSubscription: true,
    category: 'ntsa',
  },
  'ntsa_number_plate_replacement': {
    name: 'Number Plate Replacement',
    description: 'Replace lost or damaged number plates',
    creditsRequired: 5,
    requiresSubscription: true,
    category: 'ntsa',
  },
  
  // DCI Services - require subscription
  'dci_police_clearance_citizen': {
    name: 'Police Clearance Certificate (Citizens)',
    description: 'Police clearance certificate for Kenyan citizens',
    creditsRequired: 8,
    requiresSubscription: true,
    category: 'dci',
  },
  'dci_police_clearance_foreigner': {
    name: 'Police Clearance Certificate (Foreigners)',
    description: 'Police clearance certificate for foreign nationals',
    creditsRequired: 12,
    requiresSubscription: true,
    category: 'dci',
  },
  
  // Business Registration Services - require subscription
  'business_name_search': {
    name: 'Business Name Search',
    description: 'Search for business name availability',
    creditsRequired: 3,
    requiresSubscription: true,
    category: 'business',
  },
  'business_registration': {
    name: 'Business Registration',
    description: 'Register a new business',
    creditsRequired: 15,
    requiresSubscription: true,
    category: 'business',
  },
};

export class MCPServer {
  async handleRequest(request: MCPRequest, user: User): Promise<MCPResponse> {
    const { method, params } = request;
    
    try {
      switch (method) {
        case 'list_services':
          return this.listServices(user);
        
        case 'ntsa_driving_license_renewal':
        case 'ntsa_vehicle_registration':
        case 'ntsa_logbook_replacement':
        case 'ntsa_number_plate_replacement':
          return await this.handleNTSAService(method, params, user);
        
        case 'dci_police_clearance_citizen':
        case 'dci_police_clearance_foreigner':
          return await this.handleDCIService(method, params, user);
        
        case 'business_name_search':
        case 'business_registration':
          return await this.handleBusinessService(method, params, user);
        
        default:
          return {
            error: {
              code: -32601,
              message: `Method '${method}' not found`,
            },
          };
      }
    } catch (error) {
      return {
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
      };
    }
  }

  private listServices(user: User): MCPResponse {
    const availableServices = Object.entries(SERVICES).map(([key, service]) => ({
      method: key,
      ...service,
      available: !service.requiresSubscription || user.isSubscribed,
      creditsAvailable: user.credits >= service.creditsRequired,
    }));

    return {
      result: {
        services: availableServices,
        userCredits: user.credits,
        isSubscribed: user.isSubscribed,
      },
    };
  }

  private async checkServiceAccess(method: string, user: User): Promise<void> {
    const service = SERVICES[method];
    if (!service) {
      throw new Error('Service not found');
    }

    if (service.requiresSubscription && !user.isSubscribed) {
      throw new Error('Subscription required for this service');
    }

    if (user.credits < service.creditsRequired) {
      throw new Error(`Insufficient credits. Required: ${service.creditsRequired}, Available: ${user.credits}`);
    }
  }

  private async deductCredits(method: string, user: User, params: any): Promise<void> {
    const service = SERVICES[method];
    
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: user.credits - service.creditsRequired },
      }),
      prisma.serviceUsage.create({
        data: {
          userId: user.id,
          serviceName: method,
          creditsUsed: service.creditsRequired,
          requestData: params,
        },
      }),
    ]);
  }

  private async handleNTSAService(method: string, params: any, user: User): Promise<MCPResponse> {
    await this.checkServiceAccess(method, user);
    
    // Simulate NTSA service processing
    const mockResponses = {
      ntsa_driving_license_renewal: {
        status: 'success',
        applicationNumber: `DL${Date.now()}`,
        message: 'Driving license renewal application submitted successfully',
        estimatedProcessingTime: '5-7 business days',
      },
      ntsa_vehicle_registration: {
        status: 'success',
        applicationNumber: `VR${Date.now()}`,
        message: 'Vehicle registration application submitted successfully',
        estimatedProcessingTime: '10-14 business days',
      },
      ntsa_logbook_replacement: {
        status: 'success',
        applicationNumber: `LB${Date.now()}`,
        message: 'Logbook replacement application submitted successfully',
        estimatedProcessingTime: '7-10 business days',
      },
      ntsa_number_plate_replacement: {
        status: 'success',
        applicationNumber: `NP${Date.now()}`,
        message: 'Number plate replacement application submitted successfully',
        estimatedProcessingTime: '3-5 business days',
      },
    };

    await this.deductCredits(method, user, params);
    
    return {
      result: mockResponses[method as keyof typeof mockResponses],
    };
  }

  private async handleDCIService(method: string, params: any, user: User): Promise<MCPResponse> {
    await this.checkServiceAccess(method, user);
    
    const mockResponses = {
      dci_police_clearance_citizen: {
        status: 'success',
        applicationNumber: `PCC${Date.now()}`,
        message: 'Police clearance certificate application submitted successfully',
        estimatedProcessingTime: '14-21 business days',
        requiredDocuments: ['National ID copy', 'Passport photos', 'Application form'],
      },
      dci_police_clearance_foreigner: {
        status: 'success',
        applicationNumber: `PCF${Date.now()}`,
        message: 'Police clearance certificate application submitted successfully',
        estimatedProcessingTime: '21-30 business days',
        requiredDocuments: ['Passport copy', 'Visa copy', 'Application form', 'Fingerprints'],
      },
    };

    await this.deductCredits(method, user, params);
    
    return {
      result: mockResponses[method as keyof typeof mockResponses],
    };
  }

  private async handleBusinessService(method: string, params: any, user: User): Promise<MCPResponse> {
    await this.checkServiceAccess(method, user);
    
    const mockResponses = {
      business_name_search: {
        status: 'success',
        searchResults: [
          {
            name: params.businessName || 'Sample Business',
            available: Math.random() > 0.5,
            similarNames: ['Sample Business Ltd', 'Sample Business Co.'],
          },
        ],
        searchId: `BS${Date.now()}`,
      },
      business_registration: {
        status: 'success',
        registrationNumber: `BR${Date.now()}`,
        certificateNumber: `CERT${Date.now()}`,
        message: 'Business registration application submitted successfully',
        estimatedProcessingTime: '7-14 business days',
      },
    };

    await this.deductCredits(method, user, params);
    
    return {
      result: mockResponses[method as keyof typeof mockResponses],
    };
  }
}

export const mcpServer = new MCPServer();
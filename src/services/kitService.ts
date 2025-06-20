const KIT_API_BASE_URL = 'https://api.kit.com/v4';

export interface KitSubscriber {
  email_address: string;
  first_name?: string;
  referrer?: string;
}

export interface KitResponse {
  subscriber: {
    id: number;
    first_name: string | null;
    email_address: string;
    state: string;
    created_at: string;
    added_at?: string;
    fields: Record<string, any>;
    referrer?: string;
    referrer_utm_parameters?: {
      source?: string;
      medium?: string;
      campaign?: string;
      term?: string;
      content?: string;
    };
  };
}

export class KitService {
  private apiKey: string;
  private formId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_KIT_API_KEY;
    this.formId = '8209587'; // Your specific form ID
    
    if (!this.apiKey) {
      throw new Error('Kit API key not found in environment variables');
    }
  }

  async addSubscriberToForm(subscriberData: KitSubscriber): Promise<KitResponse> {
    try {
      // Step 1: Create or get the subscriber
      const createResponse = await fetch(`${KIT_API_BASE_URL}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': this.apiKey,
        },
        body: JSON.stringify({
          email_address: subscriberData.email_address,
          state: 'inactive',
          ...(subscriberData.first_name && { first_name: subscriberData.first_name }),
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        
        // Handle duplicate subscriber (409 conflict)
        if (createResponse.status === 409) {
          // Subscriber already exists, we need to get their ID
          // Try to find the subscriber by email
          const searchResponse = await fetch(`${KIT_API_BASE_URL}/subscribers?email_address=${encodeURIComponent(subscriberData.email_address)}`, {
            method: 'GET',
            headers: {
              'X-Kit-Api-Key': this.apiKey,
            },
          });
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.subscribers && searchData.subscribers.length > 0) {
              const existingSubscriber = searchData.subscribers[0];
              
              // Step 2: Add existing subscriber to form
              return await this.addExistingSubscriberToForm(existingSubscriber.id, subscriberData.referrer);
            }
          }
          
          throw new Error('Subscriber already exists but could not be found');
        }
        
        throw new Error(`Kit API error: ${createResponse.status} ${createResponse.statusText} - ${JSON.stringify(errorData)}`);
      }

      const createData: KitResponse = await createResponse.json();
      
      // Step 2: Add the new subscriber to the form
      return await this.addExistingSubscriberToForm(createData.subscriber.id, subscriberData.referrer);
      
    } catch (error) {
      console.error('Error adding subscriber to Kit form:', error);
      throw error;
    }
  }

  private async addExistingSubscriberToForm(subscriberId: number, referrer?: string): Promise<KitResponse> {
    const addToFormResponse = await fetch(`${KIT_API_BASE_URL}/forms/${this.formId}/subscribers/${subscriberId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': this.apiKey,
      },
      body: JSON.stringify({
        ...(referrer && { referrer }),
      }),
    });

    if (!addToFormResponse.ok) {
      const errorData = await addToFormResponse.json().catch(() => ({}));
      throw new Error(`Kit API error adding to form: ${addToFormResponse.status} ${addToFormResponse.statusText} - ${JSON.stringify(errorData)}`);
    }

    return await addToFormResponse.json();
  }
}

export const kitService = new KitService(); 
export class PaymentOrder {
    private id: string;
    private status: 'CREATED' | 'APPROVED' | 'FAILED' | 'COMPLETED';
    private approveLink?: string;
    private captureLink?: string;
  
    constructor(id: string, status: 'CREATED' | 'APPROVED' | 'FAILED' | 'COMPLETED', links: { rel: string; href: string }[]) {
      this.id = id;
      this.status = status;
      this.approveLink = links.find((link) => link.rel === 'approve')?.href;
    }
  
    getId(): string {
      return this.id;
    }
  
    getStatus(): string {
      return this.status;
    }
  
    getApproveLink(): string | undefined {
      return this.approveLink;
    }
  
  
    getCaptureLink(): string | undefined {
      return this.captureLink;
    }
  
    updateStatus(newStatus: 'CREATED' | 'APPROVED' | 'FAILED' | 'COMPLETED'): void {
      this.status = newStatus;
    }
  }
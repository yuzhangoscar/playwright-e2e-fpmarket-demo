// Mock blacklist data store
// In a real application, this would be connected to a database
export interface BlacklistEntry {
  name: string;
  reason?: string;
  addedAt: string;
  addedBy?: string;
  category?: 'security' | 'compliance' | 'policy' | 'other';
}

export class BlacklistStore {
  private static instance: BlacklistStore;
  private blacklistedNames: Record<string, BlacklistEntry> = {};

  private constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  public static getInstance(): BlacklistStore {
    if (!BlacklistStore.instance) {
      BlacklistStore.instance = new BlacklistStore();
    }
    return BlacklistStore.instance;
  }

  private initializeSampleData(): void {
    const sampleEntries: BlacklistEntry[] = [
      {
        name: 'malicious_user',
        reason: 'Security threat detected',
        addedAt: '2024-01-15T10:00:00Z',
        addedBy: 'security_team',
        category: 'security',
      },
      {
        name: 'spam_bot',
        reason: 'Automated spam behavior',
        addedAt: '2024-02-01T14:30:00Z',
        addedBy: 'admin',
        category: 'policy',
      },
      {
        name: 'test_user_blocked',
        reason: 'Test account for compliance testing',
        addedAt: '2024-03-10T09:15:00Z',
        addedBy: 'compliance_team',
        category: 'compliance',
      },
      {
        name: 'deprecated_account',
        reason: 'Legacy account no longer supported',
        addedAt: '2024-01-05T16:45:00Z',
        addedBy: 'system',
        category: 'policy',
      },
      {
        name: 'suspicious_actor',
        reason: 'Multiple policy violations',
        addedAt: '2024-02-20T11:20:00Z',
        addedBy: 'moderator',
        category: 'security',
      },
    ];

    sampleEntries.forEach(entry => {
      this.blacklistedNames[entry.name.toLowerCase()] = entry;
    });
  }

  public isBlacklisted(name: string): boolean {
    return this.blacklistedNames.hasOwnProperty(name.toLowerCase());
  }

  public getBlacklistEntry(name: string): BlacklistEntry | undefined {
    return this.blacklistedNames[name.toLowerCase()];
  }

  public getAllBlacklisted(): BlacklistEntry[] {
    return Object.values(this.blacklistedNames);
  }

  public addToBlacklist(entry: Omit<BlacklistEntry, 'addedAt'>): BlacklistEntry {
    const fullEntry: BlacklistEntry = {
      ...entry,
      addedAt: new Date().toISOString(),
    };
    this.blacklistedNames[entry.name.toLowerCase()] = fullEntry;
    return fullEntry;
  }

  public removeFromBlacklist(name: string): boolean {
    const key = name.toLowerCase();
    if (this.blacklistedNames.hasOwnProperty(key)) {
      delete this.blacklistedNames[key];
      return true;
    }
    return false;
  }

  public getBlacklistStats() {
    const entries = this.getAllBlacklisted();
    const categories = entries.reduce(
      (acc, entry) => {
        const category = entry.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: entries.length,
      categories,
      lastUpdated:
        entries.length > 0
          ? Math.max(...entries.map(e => new Date(e.addedAt).getTime()))
          : Date.now(),
    };
  }
}

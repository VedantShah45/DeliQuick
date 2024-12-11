declare module '@heroicons/react/solid' {
    const content: any;
    export = content;
  }
  
  type OrdersPageProps = { orders:
    Order[]; filters: { status: string[];
    areas: string[]; date: string;
    };
    }

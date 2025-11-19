import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- 1. Interfaces & Types (Định nghĩa dữ liệu) ---

type Status = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'NEEDS_WORK';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'BA' | 'DEV' | 'PO' | 'ARCHITECT' | string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: 'GENERAL' | 'CHANGE_REQUEST';
}

interface Requirement {
  id: string;
  title: string;
  code: string; // e.g., REQ-001
  description: string;
  acceptanceCriteria: string[];
  priority: Priority;
  status: Status;
  author: User;
  assignee: User;
  dueDate: Date;
  comments: Comment[];
  project: string;
}

// --- 2. Mock Data (Dữ liệu giả lập) ---

const CURRENT_USER: User = {
  id: 'u1',
  name: 'Nguyễn Văn Architect',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  role: 'ARCHITECT'
};

const MOCK_REQS: Requirement[] = [
  {
    id: '1',
    code: 'REQ-2024-001',
    title: 'Tích hợp đăng nhập SSO qua Google',
    project: 'Project Phoenix',
    description:
      'Hệ thống cần cho phép người dùng nội bộ đăng nhập sử dụng tài khoản Google Workspace của công ty. Yêu cầu bảo mật 2 lớp.',
    acceptanceCriteria: [
      'Nút "Login with Google" hiển thị trên trang đăng nhập',
      'Chỉ chấp nhận domain @company.com',
      'Tự động tạo user profile nếu lần đầu đăng nhập'
    ],
    priority: 'HIGH',
    status: 'IN_REVIEW',
    author: { id: 'u2', name: 'Trần Thu BA', avatar: 'https://i.pravatar.cc/150?u=u2', role: 'BA' },
    assignee: CURRENT_USER,
    dueDate: new Date('2024-12-01'),
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'Trần Thu BA',
        userAvatar: 'https://i.pravatar.cc/150?u=u2',
        content: 'Em đã cập nhật lại flow theo góp ý hôm qua, anh xem giúp em nhé.',
        timestamp: new Date(Date.now() - 86400000),
        type: 'GENERAL'
      }
    ]
  },
  {
    id: '2',
    code: 'REQ-2024-005',
    title: 'Dashboard báo cáo doanh thu theo thời gian thực',
    project: 'Project Phoenix',
    description: 'Xây dựng biểu đồ Line Chart hiển thị doanh thu trong ngày, update mỗi 5 phút.',
    acceptanceCriteria: ['Load dữ liệu dưới 2s', 'Có filter theo Chi nhánh', 'Export dữ liệu ra Excel'],
    priority: 'MEDIUM',
    status: 'DRAFT',
    author: { id: 'u2', name: 'Trần Thu BA', avatar: 'https://i.pravatar.cc/150?u=u2', role: 'BA' },
    assignee: CURRENT_USER,
    dueDate: new Date('2024-12-10'),
    comments: []
  },
  {
    id: '3',
    code: 'REQ-2024-012',
    title: 'API Gateway Rate Limiting',
    project: 'Core Infrastructure',
    description: 'Thiết lập giới hạn request 1000 req/phút cho mỗi IP public.',
    acceptanceCriteria: ['Return 429 Too Many Requests khi vượt ngưỡng', 'Whitelist IP văn phòng', 'Log lại các IP vi phạm'],
    priority: 'HIGH',
    status: 'APPROVED',
    author: { id: 'u3', name: 'Lê Dev Lead', avatar: 'https://i.pravatar.cc/150?u=u3', role: 'DEV' },
    assignee: CURRENT_USER,
    dueDate: new Date('2024-11-20'),
    comments: []
  }
];

// --- 3. Main Component ---

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      <!-- SIDEBAR -->
      <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-slate-100">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-indigo-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-lg font-bold text-slate-800 tracking-tight">ReqReview</span>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <button (click)="setView('dashboard')" 
            [class]="currentView() === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Tổng quan (Dashboard)
          </button>

          <div class="pt-4 pb-2">
            <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Dự án</p>
          </div>

          <button (click)="filterProject('Project Phoenix')" 
            [class]="activeProject() === 'Project Phoenix' && currentView() === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors">
            <span class="w-2 h-2 rounded-full bg-orange-400 mr-3"></span>
            Project Phoenix
          </button>
          <button (click)="filterProject('Core Infrastructure')"
            [class]="activeProject() === 'Core Infrastructure' && currentView() === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'"
             class="w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-3"></span>
            Core Infrastructure
          </button>
        </nav>

        <!-- User Profile Mini -->
        <div class="p-4 border-t border-slate-200">
          <div class="flex items-center">
            <img [src]="currentUser.avatar" class="h-9 w-9 rounded-full border border-slate-200" alt="User Avatar">
            <div class="ml-3">
              <p class="text-sm font-medium text-slate-700">{{currentUser.name}}</p>
              <p class="text-xs text-slate-500">{{currentUser.role}}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="flex-1 flex flex-col overflow-hidden relative">
        
        <!-- Header -->
        <header class="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 class="text-xl font-bold text-slate-800">
            <ng-container *ngIf="currentView() === 'dashboard'">Tổng quan</ng-container>
            <ng-container *ngIf="currentView() === 'list'">Danh sách yêu cầu</ng-container>
            <ng-container *ngIf="currentView() === 'detail'">Chi tiết yêu cầu</ng-container>
          </h1>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input type="text" placeholder="Tìm kiếm yêu cầu..." class="pl-10 pr-4 py-2 rounded-full bg-slate-100 border-none text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button class="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        <!-- DYNAMIC CONTENT -->
        <div class="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          
          <!-- VIEW: DASHBOARD -->
          <ng-container *ngIf="currentView() === 'dashboard'">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <!-- Stat Card 1 -->
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-slate-500 text-sm font-medium">Chờ duyệt</p>
                    <h3 class="text-3xl font-bold text-slate-800 mt-1">{{ stats().pending }}</h3>
                  </div>
                  <div class="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="text-xs text-slate-400">Có 2 yêu cầu sắp hết hạn</div>
              </div>

              <!-- Stat Card 2 -->
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-slate-500 text-sm font-medium">Đã duyệt tuần này</p>
                    <h3 class="text-3xl font-bold text-slate-800 mt-1">{{ stats().approved }}</h3>
                  </div>
                  <div class="p-2 bg-green-100 rounded-lg text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="text-xs text-green-600 font-medium">+12% so với tuần trước</div>
              </div>

              <!-- Stat Card 3 -->
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-slate-500 text-sm font-medium">Tổng yêu cầu</p>
                    <h3 class="text-3xl font-bold text-slate-800 mt-1">{{ requirements().length }}</h3>
                  </div>
                  <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div class="text-xs text-slate-400">Đang hoạt động tích cực</div>
              </div>
            </div>

            <h3 class="text-lg font-bold text-slate-800 mb-4">Yêu cầu cần chú ý</h3>
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th class="px-6 py-4">Mã REQ</th>
                    <th class="px-6 py-4">Tiêu đề</th>
                    <th class="px-6 py-4">Trạng thái</th>
                    <th class="px-6 py-4">Độ ưu tiên</th>
                    <th class="px-6 py-4">Người tạo</th>
                    <th class="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr *ngFor="let req of filteredRequirements(); trackBy: trackByReq" class="hover:bg-slate-50/80 transition-colors group cursor-pointer" (click)="selectRequirement(req)">
                      <td class="px-6 py-4 text-sm font-mono text-slate-500">{{req.code}}</td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-slate-800">{{req.title}}</div>
                        <div class="text-xs text-slate-400">{{req.project}}</div>
                      </td>
                      <td class="px-6 py-4">
                        <span [ngClass]="getStatusClass(req.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                          {{ getStatusLabel(req.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span [ngClass]="getPriorityClass(req.priority)" class="flex items-center text-xs font-medium">
                          <span class="w-1.5 h-1.5 rounded-full mr-2" [ngClass]="getPriorityDotClass(req.priority)"></span>
                          {{req.priority}}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                         <img [src]="req.author.avatar" class="w-6 h-6 rounded-full border border-white shadow-sm" [title]="req.author.name">
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button class="text-indigo-600 opacity-0 group-hover:opacity-100 hover:bg-indigo-50 p-2 rounded-lg transition-all text-xs font-bold">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </ng-container>

          <!-- VIEW: LIST (Reusing the table logic but full page usually allows filters) -->
          <ng-container *ngIf="currentView() === 'list'">
             <!-- Filter bar (Mock) -->
             <div class="flex space-x-2 mb-6 overflow-x-auto pb-2">
                <button class="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium shadow-md shadow-slate-200">Tất cả</button>
                <button class="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">Của tôi</button>
                <button class="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">Chờ duyệt</button>
                <button class="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">Đã duyệt</button>
             </div>

             <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
                <!-- Same table as Dashboard for simplicity in this MVP -->
                 <table class="w-full text-left border-collapse">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th class="px-6 py-4">Mã REQ</th>
                    <th class="px-6 py-4">Tiêu đề</th>
                    <th class="px-6 py-4">Trạng thái</th>
                    <th class="px-6 py-4">Deadline</th>
                    <th class="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr *ngFor="let req of filteredRequirements(); trackBy: trackByReq" class="hover:bg-slate-50/80 transition-colors cursor-pointer" (click)="selectRequirement(req)">
                      <td class="px-6 py-4 text-sm font-mono text-slate-500">{{req.code}}</td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-slate-800">{{req.title}}</div>
                        <div class="text-xs text-slate-400">{{req.project}}</div>
                      </td>
                      <td class="px-6 py-4">
                        <span [ngClass]="getStatusClass(req.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                          {{ getStatusLabel(req.status) }}
                        </span>
                      </td>
                       <td class="px-6 py-4 text-sm text-slate-600">
                        {{req.dueDate | date:'dd/MM/yyyy'}}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                    </tr>
                </tbody>
              </table>
             </div>
          </ng-container>

          <!-- VIEW: DETAIL -->
          <ng-container *ngIf="currentView() === 'detail' && selectedReq()">
            <div class="max-w-5xl mx-auto animate-fade-in">
              <!-- Detail Header -->
              <div class="bg-white rounded-t-2xl p-8 border-b border-slate-100 flex justify-between items-start shadow-sm">
                <div>
                   <div class="flex items-center space-x-3 mb-2">
                     <span class="bg-slate-100 text-slate-600 text-xs font-mono px-2 py-1 rounded">{{selectedReq()?.code}}</span>
                     <span class="text-slate-300">|</span>
                     <span class="text-sm text-indigo-600 font-medium">{{selectedReq()?.project}}</span>
                   </div>
                   <h2 class="text-3xl font-bold text-slate-800 mb-2">{{selectedReq()?.title}}</h2>
                   <div class="flex items-center space-x-4 text-sm text-slate-500">
                     <div class="flex items-center">
                       <img [src]="selectedReq()?.author?.avatar" class="w-5 h-5 rounded-full mr-2">
                       Tạo bởi <span class="font-medium text-slate-700 ml-1">{{selectedReq()?.author?.name}}</span>
                     </div>
                     <div class="flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                       {{selectedReq()?.dueDate | date:'dd MMM, yyyy'}}
                     </div>
                   </div>
                </div>

                <div class="flex flex-col items-end space-y-3">
                  <span [ngClass]="getStatusClass(selectedReq()!.status)" class="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                    {{ getStatusLabel(selectedReq()!.status) }}
                  </span>
                  
                  <div *ngIf="selectedReq()!.status === 'IN_REVIEW'">
                    <div class="flex space-x-2">
                      <button (click)="updateStatus('NEEDS_WORK')" class="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
                        Yêu cầu chỉnh sửa
                      </button>
                      <button (click)="updateStatus('APPROVED')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 text-sm font-medium transition-colors flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Phê duyệt
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col lg:flex-row gap-6 mt-6">
                <!-- Left Column: Content -->
                <div class="flex-1 space-y-6">
                   <!-- Description -->
                   <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                     <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                       Mô tả chi tiết
                     </h3>
                     <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{selectedReq()?.description}}</p>
                   </div>

                   <!-- Acceptance Criteria -->
                   <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                      <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                       Tiêu chí chấp nhận (AC)
                     </h3>
                     <ul class="space-y-3">
                       <li *ngFor="let ac of selectedReq()?.acceptanceCriteria; trackBy: trackByValue" class="flex items-start">
                           <div class="flex-shrink-0 w-5 h-5 rounded border border-slate-300 mt-0.5 mr-3 flex items-center justify-center">
                             <div class="w-2.5 h-2.5 bg-indigo-600 rounded-sm opacity-0 hover:opacity-100 cursor-pointer transition-opacity"></div>
                           </div>
                           <span class="text-slate-700">{{ac}}</span>
                       </li>
                     </ul>
                   </div>
                </div>

                <!-- Right Column: Comments / Activity -->
                <div class="w-full lg:w-80 shrink-0">
                  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
                     <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Thảo luận</h3>
                     
                     <!-- Comment List -->
                     <div class="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px] pr-2 custom-scrollbar">
                       <div *ngIf="(selectedReq()?.comments?.length || 0) === 0" class="text-center py-10 text-slate-400 italic text-sm">Chưa có thảo luận nào.</div>

                       <div *ngFor="let comment of selectedReq()?.comments; trackBy: trackByComment" class="flex items-start space-x-3 group">
                           <img [src]="comment.userAvatar" class="w-8 h-8 rounded-full mt-1">
                           <div class="flex-1">
                             <div class="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100">
                               <div class="flex justify-between items-center mb-1">
                                 <span class="font-bold text-xs text-slate-700">{{comment.userName}}</span>
                                 <span class="text-[10px] text-slate-400">{{comment.timestamp | date:'shortTime'}}</span>
                               </div>
                               <p class="text-sm text-slate-600">{{comment.content}}</p>
                             </div>
                           </div>
                         </div>
                     </div>

                     <!-- Input -->
                     <div class="mt-auto">
                       <textarea 
                         [(ngModel)]="newCommentText"
                         (keyup.enter)="addComment()"
                         placeholder="Viết bình luận..." 
                         class="w-full bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 min-h-[80px] resize-none mb-2"></textarea>
                       <div class="flex justify-end">
                         <button (click)="addComment()" [disabled]="!newCommentText.trim()" 
                           class="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                           Gửi
                         </button>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>

        </div>
      </main>
    </div>

    <!-- Style enhancements specific for this view -->
    <style>
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e2e8f0;
        border-radius: 20px;
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  `
})
export class AppComponent {
  // --- State Management with Signals ---
  
  // View State
  currentView = signal<'dashboard' | 'list' | 'detail'>('dashboard');
  activeProject = signal<string | null>(null);
  
  // Data State
  requirements = signal<Requirement[]>(MOCK_REQS);
  selectedReq = signal<Requirement | null>(null);
  currentUser = CURRENT_USER;
  
  // Form State
  newCommentText = '';

  // --- Computed Signals (Derived State) ---
  
  filteredRequirements = computed(() => {
    let reqs = this.requirements();
    if (this.activeProject()) {
      reqs = reqs.filter(r => r.project === this.activeProject());
    }
    return reqs;
  });

  stats = computed(() => {
    const reqs = this.requirements();
    return {
      pending: reqs.filter(r => r.status === 'IN_REVIEW').length,
      approved: reqs.filter(r => r.status === 'APPROVED').length,
      draft: reqs.filter(r => r.status === 'DRAFT').length
    };
  });

  // --- Actions ---

  setView(view: 'dashboard' | 'list' | 'detail') {
    this.currentView.set(view);
    if (view !== 'detail') {
      this.selectedReq.set(null);
    }
  }

  filterProject(projectName: string) {
    this.activeProject.set(projectName);
    this.setView('list');
  }

  selectRequirement(req: Requirement) {
    this.selectedReq.set(req);
    this.setView('detail');
  }

  updateStatus(newStatus: Status) {
    const current = this.selectedReq();
    if (!current) return;

    // Update in master list (immutable way)
    this.requirements.update(reqs => 
      reqs.map(r => r.id === current.id ? { ...r, status: newStatus } : r)
    );
    
    // Update current selected View
    this.selectedReq.set({ ...current, status: newStatus });
  }

  addComment() {
    if (!this.newCommentText.trim() || !this.selectedReq()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      content: this.newCommentText,
      timestamp: new Date(),
      type: 'GENERAL'
    };

    const currentReq = this.selectedReq()!;
    const updatedReq = {
      ...currentReq,
      comments: [...currentReq.comments, newComment]
    };

    // Update state
    this.requirements.update(reqs => 
      reqs.map(r => r.id === currentReq.id ? updatedReq : r)
    );
    this.selectedReq.set(updatedReq);

    // Reset form
    this.newCommentText = '';
  }

  // --- Helpers for UI Classes ---

  getStatusClass(status: Status): string {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border border-green-200';
      case 'IN_REVIEW': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'NEEDS_WORK': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  }

  getStatusLabel(status: Status): string {
    switch (status) {
      case 'APPROVED': return 'Đã phê duyệt';
      case 'IN_REVIEW': return 'Đang review';
      case 'NEEDS_WORK': return 'Cần chỉnh sửa';
      case 'DRAFT': return 'Nháp';
      default: return status;
    }
  }

  getPriorityClass(p: Priority): string {
    switch (p) {
      case 'HIGH': return 'text-red-600 bg-red-50 px-2 py-1 rounded';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 px-2 py-1 rounded';
      case 'LOW': return 'text-slate-500 bg-slate-100 px-2 py-1 rounded';
    }
  }

  getPriorityDotClass(p: Priority): string {
    switch (p) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-slate-400';
    }
  }

  // trackBy helpers
  trackByReq(_: number, r: Requirement) { return r.id; }
  trackByComment(_: number, c: Comment) { return c.id; }
  trackByValue(_: number, v: any) { return v; }
}
